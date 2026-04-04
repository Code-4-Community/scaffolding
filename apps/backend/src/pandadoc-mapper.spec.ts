import { pandadocMapper } from './pandadoc-mapper';
import { HeardAboutFrom, InterestArea } from './applications/types';
import { School } from './learner-info/types';
import { PANDADOC_FIELD_MAP } from './panda-field-map';

const mappingPairKey = (item: {
  targetTable: string;
  backendField: string;
}): string => `${item.targetTable}.${item.backendField}`;

const utcDate = (yyyy: number, mm: number, dd: number): Date =>
  new Date(Date.UTC(yyyy, mm - 1, dd));

function buildFullPayload(): Record<string, unknown> {
  return {
    Volunteer_StartDate: '06-01-2026',
    Volunteer_EndDate: '12-01-2026',
    email: 'ohstep23@gmail.com',
    Volunteer_Pronouns: 'he/him',
    Volunteer_Phone: '617-555-0199',
    Volunteer_Languages: '',
    Volunteer_Experience: 'Volunteer/Intern',
    Volunteer_Affiliation: 'Northeastern',
    'Volunteer_ Affiliation_Other': '',
    Volunteer_Discipline: 'Public Health',
    Volunteer_Discipline_Other: 'Some additional discipline detail',
    Volunteer_License: 'N/A',
    Volunteer_Referred: 'Yes',
    Volunteer_ReferredEmail: 'referrer@example.com',
    Volunteer_TotalHours: '10',
    Volunteer_AvailabilityMonday: '9am-12pm',
    Volunteer_AvailabilityTuesday: '',
    Volunteer_AvailabilityWednesday: '1pm-5pm',
    Volunteer_AvailabilityThursday: '',
    Volunteer_AvailabilityFriday: '9am-12pm',
    Volunteer_AvailabilitySaturday: '',
    Volunteer_ResumeUpload2: 'owen_resume.pdf',
    Volunteer_CoverletterUpload2: 'owen_cl.pdf',
    Volunteer_EmergencyContactName: 'Susan Stepan',
    Volunteer_EmergencyContactPhone: '617-555-0100',
    Volunteer_EmergencyContactRelationship: 'Mother',
    Volunteer_Interest_WomensHealth: 'on',
    Volunteer_Interest_AdditctionServices: 'on',
    Volunteer_Interest_PrimaryCare: 'on',
    Volunteer_Interest_StreetMedicine: 'on',
    Volunteer_Interest_Dental: 'on',
    Volunteer_Interest_HIV: 'on',
    Volunteer_Interest_CaseManagement: 'on',
    Volunteer_HearAboutUs_School: 'on',
    Volunteer_HearAboutUs_Website: 'on',
    Volunteer_FormFor: 'Supervisor/Instructor',
    Volunteer_Age: 'No',
    Volunteer_DOB: '02-04-2026',
    Volunteer_Department: 'Khoury College',
    Volunteer_CourseRequirements: '120 clinical hours',
    Volunteer_InstructorInfo: 'Dr. Smith, smith@northeastern.edu',
    Volunteer_SyllabusUpload: 'cs3500_syllabus.pdf',
  };
}

function buildCoveragePayload(): Record<string, unknown> {
  return {
    ...buildFullPayload(),
    'Volunteer_ Affiliation_Other': 'Coverage University',
    Volunteer_Interest_VeteransServices: 'on',
    Volunteer_Interest_Respite: 'on',
    Volunteer_Interest_FamilyServices: 'on',
    Volunteer_Interest_BehavioralHealth: 'on',
    Volunteer_Interest_HepC: 'on',
    Volunteer_HearAboutUs_OnlineSearch: 'on',
    Volunteer_HearAboutUs_FromStaff: 'on',
    Volunteer_HearAboutUs_CurrentStaff: 'on',
    Volunteer_HearAboutUs_FriendFamily: 'on',
    Volunteer_HearAboutUs_Other: 'on',
  };
}

describe('pandadocMapper', () => {
  it('maps a complete submission into the correct buckets', () => {
    const result = pandadocMapper(buildFullPayload());

    expect(result.application['email']).toBe('ohstep23@gmail.com');
    expect(result.application['proposedStartDate']).toEqual(
      utcDate(2026, 6, 1),
    );
    expect(result.application['endDate']).toEqual(utcDate(2026, 12, 1));
    expect(result.application['pronouns']).toBe('he/him');
    expect(result.application['phone']).toBe('617-555-0199');
    expect(result.application['weeklyHours']).toBe(10);
    expect(result.application['referred']).toBe(true);
    expect(result.application['referredEmail']).toBe('referrer@example.com');
    expect(result.application['elaborateOtherDiscipline']).toBe(
      'Some additional discipline detail',
    );
    expect(result.application['emergencyContactName']).toBe('Susan Stepan');
  });

  it('maps email to candidateInfo', () => {
    const result = pandadocMapper(buildFullPayload());
    expect(result.candidateInfo['email']).toBe('ohstep23@gmail.com');
  });

  it('maps experience_type to desiredExperience on application', () => {
    const result = pandadocMapper(buildFullPayload());
    expect(result.application['desiredExperience']).toBe('Volunteer/Intern');
  });

  it('parses total_hours as a number', () => {
    const result = pandadocMapper(buildFullPayload());
    expect(typeof result.application['weeklyHours']).toBe('number');
    expect(result.application['weeklyHours']).toBe(10);
  });

  it('defaults weeklyHours to 0 when missing or invalid', () => {
    const missingHours = buildFullPayload();
    delete missingHours['Volunteer_TotalHours'];

    const invalidHours = buildFullPayload();
    invalidHours['Volunteer_TotalHours'] = 'no numeric value';

    expect(pandadocMapper(missingHours).application['weeklyHours']).toBe(0);
    expect(pandadocMapper(invalidHours).application['weeklyHours']).toBe(0);
  });

  it('converts boolean-style fields correctly', () => {
    const result = pandadocMapper(buildFullPayload());
    expect(result.learnerInfo['isSupervisorApplying']).toBe(true);
    expect(result.learnerInfo['isLegalAdult']).toBe(false);
  });

  it('aggregates checked interest checkboxes into an array', () => {
    const result = pandadocMapper(buildFullPayload());
    const interests = result.application['interest'] as string[];

    expect(Array.isArray(interests)).toBe(true);
    expect(interests).toContain(InterestArea.WOMENS_HEALTH);
    expect(interests).toContain(InterestArea.ADDICTION_MEDICINE);
    expect(interests).toContain(InterestArea.PRIMARY_CARE);
    expect(interests).toContain(InterestArea.STREET_MEDICINE);
    expect(interests).toContain(InterestArea.DENTAL);
    expect(interests).toContain(InterestArea.HIV_SERVICES);
    expect(interests).toContain(InterestArea.CASE_MANAGEMENT);
    expect(interests).not.toContain(InterestArea.BEHAVIORAL_HEALTH);
    expect(interests).not.toContain(InterestArea.HEP_C_CARE);
  });

  it('aggregates checked hear-about-us checkboxes into heardAboutFrom', () => {
    const result = pandadocMapper(buildFullPayload());
    const heardAbout = result.application['heardAboutFrom'] as string[];

    expect(Array.isArray(heardAbout)).toBe(true);
    expect(heardAbout).toContain(HeardAboutFrom.SCHOOL);
    expect(heardAbout).toContain(HeardAboutFrom.BHCHP_WEBSITE);
    expect(heardAbout).not.toContain(HeardAboutFrom.ONLINE_SEARCH);
  });

  it('falls back to defaultValue for blank optional fields', () => {
    const result = pandadocMapper(buildFullPayload());
    expect(result.application['tuesdayAvailability']).toBe('');
    expect(result.application['saturdayAvailability']).toBe('');
  });

  it('sets optional fields to null when not provided and no defaultValue', () => {
    const payload = buildFullPayload();
    delete payload['Volunteer_Languages'];
    const result = pandadocMapper(payload);
    expect(result.application['nonEnglishLangs']).toBeNull();
  });

  it('throws when a required field is missing', () => {
    const payload = buildFullPayload();
    delete payload['email'];
    expect(() => pandadocMapper(payload)).toThrow(
      /Missing required PandaDoc fields/,
    );
    expect(() => pandadocMapper(payload)).toThrow(/email/);
  });

  it('throws listing all missing required fields at once', () => {
    const payload = buildFullPayload();
    delete payload['email'];
    delete payload['Volunteer_StartDate'];
    delete payload['Volunteer_ResumeUpload2'];

    try {
      pandadocMapper(payload);
      fail('expected an error');
    } catch (e) {
      const msg = (e as Error).message;
      expect(msg).toContain('email');
      expect(msg).toContain('Volunteer_StartDate');
      expect(msg).toContain('Volunteer_ResumeUpload2');
    }
  });

  it('maps school_affiliation to learnerInfo only', () => {
    const payload = buildFullPayload();
    payload['Volunteer_ Affiliation_Other'] = '';
    const result = pandadocMapper(payload);
    expect(result.learnerInfo['school']).toBe(School.OTHER);
    expect(result.learnerInfo['otherSchool']).toBe('Northeastern');
    expect(result.application['school']).toBeUndefined();
  });

  it('maps known affiliations to valid School enum values', () => {
    const cases: Array<{ input: string; expected: School }> = [
      {
        input: 'Harvard Medical School',
        expected: School.HARVARD_MEDICAL_SCHOOL,
      },
      { input: 'Johns Hopkins University', expected: School.JOHNS_HOPKINS },
      { input: 'JHMI program', expected: School.JOHNS_HOPKINS },
      { input: 'Stanford Medicine', expected: School.STANFORD_MEDICINE },
      { input: 'Mayo Clinic', expected: School.MAYO_CLINIC },
    ];

    for (const testCase of cases) {
      const payload = buildFullPayload();
      payload['Volunteer_Affiliation'] = testCase.input;
      const result = pandadocMapper(payload);
      expect(result.learnerInfo['school']).toBe(testCase.expected);
    }
  });

  it('maps otherSchool to learnerInfo', () => {
    const payload = buildFullPayload();
    payload['Volunteer_ Affiliation_Other'] = 'Northeastern University';
    const result = pandadocMapper(payload);
    expect(result.learnerInfo['otherSchool']).toBe('Northeastern University');
  });

  it('maps learnerInfo fields correctly', () => {
    const result = pandadocMapper(buildFullPayload());
    expect(result.learnerInfo['schoolDepartment']).toBe('Khoury College');
    expect(result.learnerInfo['courseRequirements']).toBe('120 clinical hours');
    expect(result.learnerInfo['instructorInfo']).toBe(
      'Dr. Smith, smith@northeastern.edu',
    );
    expect(result.learnerInfo['dateOfBirth']).toEqual(utcDate(2026, 2, 4));
  });

  it('maps license to both application and volunteerInfo', () => {
    const result = pandadocMapper(buildFullPayload());
    expect(result.application['license']).toBe('N/A');
    expect(result.volunteerInfo['license']).toBe('N/A');
  });

  it('handles native PandaDoc checkbox and collect_file value types', () => {
    const payload = {
      ...buildFullPayload(),
      Volunteer_DOB: '04-01-2026',
      Volunteer_StartDate: '04-16-2026',
      Volunteer_EndDate: '04-30-2026',
      Volunteer_TotalHours: 'efse 13',
      Volunteer_Referred: false,
      Volunteer_ReferredEmail: '',
      Volunteer_Interest_BehavioralHealth: true,
      Volunteer_Interest_PrimaryCare: true,
      Volunteer_Interest_HepC: true,
      Volunteer_Interest_VeteransServices: false,
      Volunteer_Interest_HIV: false,
      Volunteer_Interest_Dental: false,
      Volunteer_HearAboutUs_Website: true,
      Volunteer_HearAboutUs_FromStaff: true,
      Volunteer_HearAboutUs_CurrentStaff: true,
      Volunteer_HearAboutUs_School: false,
      Volunteer_HearAboutUs_OnlineSearch: false,
      Volunteer_ResumeUpload2: {
        name: 'Student_Volunteer Interest Form.pdf',
        url: 'https://example.com/resume.pdf',
      },
      Volunteer_CoverletterUpload2: {
        name: 'Student_Volunteer Interest Form.pdf',
        url: 'https://example.com/cover.pdf',
      },
      Volunteer_SyllabusUpload: {
        name: 'Student_Volunteer Interest Form.pdf',
        url: 'https://example.com/syllabus.pdf',
      },
    };

    const result = pandadocMapper(payload);

    expect(result.application['weeklyHours']).toBe(13);
    expect(result.application['referred']).toBe(false);
    expect(result.application['referredEmail']).toBeNull();
    expect(result.application['resume']).toBe(
      'Student_Volunteer Interest Form.pdf',
    );
    expect(result.application['coverLetter']).toBe(
      'Student_Volunteer Interest Form.pdf',
    );
    expect(result.learnerInfo['syllabus']).toBe(
      'Student_Volunteer Interest Form.pdf',
    );

    const interests = result.application['interest'] as string[];
    expect(interests).toContain(InterestArea.BEHAVIORAL_HEALTH);
    expect(interests).toContain(InterestArea.PRIMARY_CARE);
    expect(interests).toContain(InterestArea.HEP_C_CARE);
    expect(interests).not.toContain(InterestArea.VETERANS_SERVICES);
    expect(interests).not.toContain(InterestArea.HIV_SERVICES);
    expect(interests).not.toContain(InterestArea.DENTAL);

    const heardAbout = result.application['heardAboutFrom'] as string[];
    expect(heardAbout).toContain(HeardAboutFrom.BHCHP_WEBSITE);
    expect(heardAbout).toContain(HeardAboutFrom.FROM_A_BHCHP_STAFF_MEMBER);
    expect(heardAbout).toContain(HeardAboutFrom.CURRENT_OR_FORMER_STAFF);
    expect(heardAbout).not.toContain(HeardAboutFrom.SCHOOL);
    expect(heardAbout).not.toContain(HeardAboutFrom.ONLINE_SEARCH);

    expect(result.application['proposedStartDate']).toEqual(
      utcDate(2026, 4, 16),
    );
    expect(result.learnerInfo['dateOfBirth']).toEqual(utcDate(2026, 4, 1));
  });

  it('covers every field mapping entry in PANDADOC_FIELD_MAP', () => {
    const payload = buildCoveragePayload();
    const result = pandadocMapper(payload);

    const aggregateFields = new Set(
      PANDADOC_FIELD_MAP.filter((item) => item.aggregate === 'array').map(
        (item) => mappingPairKey(item),
      ),
    );

    for (const item of PANDADOC_FIELD_MAP) {
      const bucket = result[item.targetTable];
      const fieldKey = mappingPairKey(item);
      const raw = payload[item.pandaDocKey];
      const expected =
        raw == null || raw === ''
          ? item.defaultValue ?? null
          : item.transform
          ? item.transform(String(raw))
          : raw;

      if (aggregateFields.has(fieldKey)) {
        expect(Array.isArray(bucket[item.backendField])).toBe(true);
        if (expected != null) {
          expect(bucket[item.backendField] as unknown[]).toContainEqual(
            expected,
          );
        }
      } else {
        expect(bucket[item.backendField]).toEqual(expected);
      }
    }
  });

  it('marks all duplicate mapping targets as explicit array aggregation', () => {
    const counts = new Map<string, number>();

    for (const item of PANDADOC_FIELD_MAP) {
      const key = mappingPairKey(item);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }

    for (const item of PANDADOC_FIELD_MAP) {
      const key = mappingPairKey(item);
      if ((counts.get(key) ?? 0) > 1) {
        expect(item.aggregate).toBe('array');
      }
    }
  });
});
