import NavBar from '../components/NavBar/NavBar';
import apiClient from '../api/apiClient';
import { Box, Heading, Spinner, Text } from '@chakra-ui/react';
import AvailabilityTable from '../components/AvailabilityTable';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { fetchUserAttributes } from 'aws-amplify/auth';
import {
  ApplicantType,
  Application,
  AppStatus,
  DISCIPLINE_VALUES,
  ExperienceType,
  InterestArea,
  LearnerInfo,
  School,
  UserType,
} from '../api/types';
import QuestionFrame from '../components/QuestionFrame';
import RequirementsFrame from '../components/RequirementsFrame';
import UploadedMaterial from '../components/UploadedMaterial';
import SchoolAffiliationFrame from '../components/SchoolAffiliationFrame';

const DEV_MODE = !!import.meta.env.VITE_DEV_AUTH_EMAIL;

const DEV_APPLICATION: Application = {
  appId: 1,
  email: 'janedoe@gmail.com',
  discipline: DISCIPLINE_VALUES.Psychiatry_or_Psychiatric_NP_PA,
  appStatus: AppStatus.APP_SUBMITTED,
  mondayAvailability: '12pm and on every other week',
  tuesdayAvailability: 'approximately 10am-3pm',
  wednesdayAvailability: 'no availability',
  thursdayAvailability: 'maybe before 10am',
  fridayAvailability: 'Sometime between 4-6',
  saturdayAvailability: 'no availability',
  experienceType: ExperienceType.BS,
  interest: [
    InterestArea.MEDICAL_RESPITE_INPATIENT,
    InterestArea.FAMILY_AND_YOUTH_SERVICES,
  ],
  license: 'nursing license',
  phone: '123-456-7890',
  applicantType: ApplicantType.LEARNER,
  referred: false,
  weeklyHours: 20,
  pronouns: 'she/her',
  nonEnglishLangs: 'spoken chinese only',
  desiredExperience: 'I want to give back to the boston community',
  resume: 'janedoe_resume_2_6_2026.pdf',
  coverLetter: 'janedoe_coverLetter_2_6_2026.pdf',
  emergencyContactName: 'Bob Doe',
  emergencyContactPhone: '111-111-1111',
  emergencyContactRelationship: 'Mother',
  heardAboutFrom: [],
};

const DEV_LEARNER_INFO: LearnerInfo = {
  appId: 1,
  school: School.HARVARD_MEDICAL_SCHOOL,
  syllabus: 'jane_doe_syllabus.pdf',
  isSupervisorApplying: false,
  isLegalAdult: true,
  courseRequirements: 'Community practicum hours',
  instructorInfo: 'Dr. Smith, smith@example.com',
};

const CandidateViewApplication: React.FC = () => {
  const [application, setApplication] = useState<Application | null>(null);
  const [learnerInfo, setLearnerInfo] = useState<LearnerInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const isNotFoundError = (err: unknown): boolean =>
      axios.isAxiosError(err) && err.response?.status === 404;

    const logAxiosError = (label: string, err: unknown) => {
      if (axios.isAxiosError(err)) {
        console.error(label, {
          status: err.response?.status,
          url: err.config?.url,
          method: err.config?.method,
          data: err.response?.data,
        });
        return;
      }

      console.error(label, err);
    };

    async function load() {
      setLoading(true);
      setError(null);
      console.debug('CandidateViewApplication: load started');

      // Dev mode: use mock data, skip all API calls
      if (DEV_MODE) {
        console.debug(
          'CandidateViewApplication: DEV_MODE enabled, using mocks',
        );
        setApplication(DEV_APPLICATION);
        if (DEV_APPLICATION.applicantType === ApplicantType.LEARNER) {
          setLearnerInfo(DEV_LEARNER_INFO);
        }
        setLoading(false);
        return;
      }

      try {
        const attributes = await fetchUserAttributes();
        const email = attributes.email;
        console.debug('CandidateViewApplication: fetched user attributes', {
          email,
        });

        if (!email) {
          setError('Unable to determine your email. Please log in again.');
          console.warn(
            'CandidateViewApplication: missing email in user attributes',
          );
          return;
        }

        console.debug(
          'CandidateViewApplication: requesting candidate info by email',
          { email },
        );
        const candidateInfo = await apiClient.getCandidateInfoByEmail(email);
        if (cancelled) return;
        console.debug('CandidateViewApplication: candidate info loaded', {
          appId: candidateInfo.appId,
          email: candidateInfo.email,
        });

        console.debug('CandidateViewApplication: requesting application', {
          appId: candidateInfo.appId,
        });
        const app = await apiClient.getApplication(candidateInfo.appId);
        if (cancelled) return;
        setApplication(app);
        console.debug('CandidateViewApplication: application loaded', {
          appId: app.appId,
          applicantType: app.applicantType,
        });

        if (app?.applicantType === ApplicantType.LEARNER) {
          try {
            console.debug('CandidateViewApplication: requesting learner info', {
              appId: candidateInfo.appId,
            });
            const info = await apiClient.getLearnerInfo(candidateInfo.appId);
            if (!cancelled) {
              setLearnerInfo(info);
              console.debug('CandidateViewApplication: learner info loaded', {
                appId: info.appId,
              });
            }
          } catch (err) {
            if (!cancelled && !isNotFoundError(err)) {
              setError('Failed to load learner info');
            }
            logAxiosError(
              'CandidateViewApplication: learner info request failed',
              err,
            );
          }
        }
      } catch (err) {
        logAxiosError('CandidateViewApplication: load failed', err);
        if (!cancelled) setError('Failed to load application');
      } finally {
        console.debug('CandidateViewApplication: load finished', {
          cancelled,
        });
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex flex-row">
        <NavBar logo="BHCHP" userType={UserType.STANDARD} />
        <Box p="10" flex="1" display="flex" justifyContent="center" mt="20">
          <Spinner size="xl" />
        </Box>
      </div>
    );
  }

  if (error || application === null) {
    return (
      <div className="flex flex-row">
        <NavBar logo="BHCHP" userType={UserType.STANDARD} />
        <Box p="10" flex="1">
          <Text color="red.500">{error ?? 'Application data not found'}</Text>
        </Box>
      </div>
    );
  }

  return (
    <div className="flex flex-row">
      <NavBar logo="BHCHP" userType={UserType.STANDARD} />
      <Box
        id="main-content"
        p="10"
        flex="1"
        display="flex"
        flexDirection="column"
        gap={6}
        overflowY="auto"
        maxH="100vh"
      >
        <SchoolAffiliationFrame
          schoolName={learnerInfo ? learnerInfo.school : 'N/A'}
          schoolDepartment={
            (learnerInfo && learnerInfo.schoolDepartment) || 'N/A'
          }
          license={application.license || 'N/A'}
          areaOfInterest={
            Array.isArray(application.interest)
              ? application.interest.join(', ')
              : application.interest ?? ''
          }
          proposedStartDate={''}
          actualStartDate={''}
          endDate={''}
          totalTimeRequested={application.weeklyHours + ' hours per week'}
        />

        <Box>
          <AvailabilityTable
            appId={application.appId}
            availability={{
              mondayAvailability: application.mondayAvailability,
              tuesdayAvailability: application.tuesdayAvailability,
              wednesdayAvailability: application.wednesdayAvailability,
              thursdayAvailability: application.thursdayAvailability,
              fridayAvailability: application.fridayAvailability,
              saturdayAvailability: application.saturdayAvailability,
            }}
            isAdmin={false}
          />
        </Box>

        <UploadedMaterial
          frameProps={{
            resume: application.resume,
            coverLetter: application.coverLetter,
            syllabus:
              application.applicantType === ApplicantType.LEARNER &&
              learnerInfo !== null
                ? learnerInfo.syllabus
                : undefined,
          }}
        />

        {application.applicantType === ApplicantType.LEARNER &&
          learnerInfo !== null && (
            <RequirementsFrame
              frameProps={{
                course_requirements: learnerInfo.courseRequirements || '',
                instructor_contact_info: learnerInfo.instructorInfo || '',
              }}
            />
          )}

        <QuestionFrame
          frameProps={{
            question: 'How did you hear about us?',
            answers: application.heardAboutFrom,
          }}
        />
        <QuestionFrame
          frameProps={{
            question: 'Other than English, what languages do you speak?',
            answers: application.nonEnglishLangs
              ? [application.nonEnglishLangs]
              : [],
          }}
        />
        {application.applicantType === ApplicantType.LEARNER &&
        learnerInfo !== null ? (
          <QuestionFrame
            frameProps={{
              question:
                'Are you applying for yourself or are you a supervisor/instructor?',
              answers: [
                learnerInfo.isSupervisorApplying ? 'Supervisor' : 'Myself',
              ],
            }}
          />
        ) : (
          <QuestionFrame
            frameProps={{
              question:
                'Are you applying for yourself or are you a supervisor/instructor?',
              answers: ['Myself'],
            }}
          />
        )}
      </Box>
    </div>
  );
};

export default CandidateViewApplication;
