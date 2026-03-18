import { pandadocMapper } from './pandadoc-mapper';
import { InterestArea } from './applications/types';

function buildFullPayload(): Record<string, unknown> {
  return {
    name: 'Owen Stepan',
    start_date: '2026-06-01',
    end_date: '2026-12-01',
    email: 'ohstep23@gmail.com',
    pronouns: 'he/him',
    phone_number: '617-555-0199',
    languages: '',
    experience_type: 'Volunteer/Intern',
    school_affiliation: 'Northeastern',
    other_school: '',
    discipline: 'Public Health',
    other_discipline: '',
    license: 'N/A',
    total_hours: '10',
    monday_availability: '9am-12pm',
    tuesday_availability: '',
    wednesday_availability: '1pm-5pm',
    thursday_availability: '',
    friday_availability: '9am-12pm',
    saturday_availability: '',
    resume: 'owen_resume.pdf',
    cover_letter: 'owen_cl.pdf',
    emergency_contact_name: 'Susan Stepan',
    emergency_contact_phone: '617-555-0100',
    emergency_contact_relationship: 'Mother',
    interest_womens_health: 'on',
    interest_addiction_medicine: 'on',
    interest_primary_care: 'on',
    interest_street_medicine: 'on',
    interest_dental: 'on',
    interest_hiv_services: 'on',
    interest_case_management: 'on',
    applicant_role: 'Supervisor/Instructor',
    over_18: 'No',
    dob: '02-04-2026',
    school_department: 'Khoury College',
    course_requirements: '120 clinical hours',
    instructor_info: 'Dr. Smith, smith@northeastern.edu',
    syllabus: 'cs3500_syllabus.pdf',
  };
}

describe('pandadocMapper', () => {
  it('maps a complete submission into the correct buckets', () => {
    const result = pandadocMapper(buildFullPayload());

    expect(result.applicant['firstName']).toBe('Owen');
    expect(result.applicant['lastName']).toBe('Stepan');
    expect(result.applicant['startDate']).toEqual(new Date('2026-06-01'));
    expect(result.applicant['endDate']).toEqual(new Date('2026-12-01'));

    expect(result.application['email']).toBe('ohstep23@gmail.com');
    expect(result.application['pronouns']).toBe('he/him');
    expect(result.application['phone']).toBe('617-555-0199');
    expect(result.application['weeklyHours']).toBe(10);
    expect(result.application['emergencyContactName']).toBe('Susan Stepan');
  });

  it('splits name into first and last', () => {
    const result = pandadocMapper(buildFullPayload());
    expect(result.applicant['firstName']).toBe('Owen');
    expect(result.applicant['lastName']).toBe('Stepan');
  });

  it('parses total_hours as a number', () => {
    const result = pandadocMapper(buildFullPayload());
    expect(typeof result.application['weeklyHours']).toBe('number');
    expect(result.application['weeklyHours']).toBe(10);
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

  it('falls back to defaultValue for blank optional fields', () => {
    const result = pandadocMapper(buildFullPayload());
    expect(result.application['tuesdayAvailability']).toBe('');
    expect(result.application['saturdayAvailability']).toBe('');
  });

  it('sets optional fields to null when not provided and no defaultValue', () => {
    const payload = buildFullPayload();
    delete payload['languages'];
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
    delete payload['name'];
    delete payload['resume'];

    try {
      pandadocMapper(payload);
      fail('expected an error');
    } catch (e) {
      const msg = (e as Error).message;
      expect(msg).toContain('email');
      expect(msg).toContain('name');
      expect(msg).toContain('resume');
    }
  });

  it('maps school_affiliation to both application and learnerInfo', () => {
    const result = pandadocMapper(buildFullPayload());
    expect(result.application['school']).toBe('Northeastern');
    expect(result.learnerInfo['school']).toBe('Northeastern');
  });

  it('maps learnerInfo fields correctly', () => {
    const result = pandadocMapper(buildFullPayload());
    expect(result.learnerInfo['schoolDepartment']).toBe('Khoury College');
    expect(result.learnerInfo['courseRequirements']).toBe('120 clinical hours');
    expect(result.learnerInfo['instructorInfo']).toBe(
      'Dr. Smith, smith@northeastern.edu',
    );
    expect(result.learnerInfo['dateOfBirth']).toEqual(new Date('02-04-2026'));
  });

  it('maps license to both application and volunteerInfo', () => {
    const result = pandadocMapper(buildFullPayload());
    expect(result.application['license']).toBe('N/A');
    expect(result.volunteerInfo['license']).toBe('N/A');
  });
});
