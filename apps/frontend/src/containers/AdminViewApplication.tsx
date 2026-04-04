import NavBar from '@components/NavBar/NavBar';
import { useParams } from 'react-router-dom';
import apiClient from '@api/apiClient';
import { Box, Spinner, Text } from '@chakra-ui/react';
import AvailabilityTable from '@components/AvailabilityTable';
import { useEffect, useState } from 'react';
import {
  ApplicantType,
  Application,
  AvailabilityFields,
  LearnerInfo,
  UserType,
  VolunteerInfo,
} from '@api/types';
import QuestionFrame from '@components/QuestionFrame';
import RequirementsFrame from '@components/RequirementsFrame';
import UploadedMaterial from '@components/UploadedMaterial';
import SchoolAffiliationFrame from '@components/SchoolAffiliationFrame';

import EmergencyContactFrame from '@components/EmergencyContactFrame';
import ApplicationProfileHeader from '@components/ApplicationProfileHeader';

const AdminViewApplication: React.FC = () => {
  const { appId } = useParams<{ appId: string }>();
  const [application, setApplication] = useState<Application | null>(null);
  const [learnerInfo, setLearnerInfo] = useState<LearnerInfo | null>(null);
  const [volunteerInfo, setVolunteerInfo] = useState<VolunteerInfo | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const firstName: string = application?.email
    ? application.email
        .split('@')[0]
        .split('.')[0]
        .replace(/^./, (c) => c.toUpperCase())
    : '';

  const lastName: string = application?.email
    ? application.email
        .split('@')[0]
        .split('.')[1]
        .replace(/^./, (c) => c.toUpperCase())
    : '';
  const pronouns = application?.pronouns;
  const discipline = application?.discipline;
  const over18: boolean = learnerInfo?.dateOfBirth
    ? (() => {
        const today = new Date();
        const dob = new Date(learnerInfo.dateOfBirth);
        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        const dayDiff = today.getDate() - dob.getDate();
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
          age--;
        }
        return age >= 18;
      })()
    : false;

  // TODO: derive from actual auth state once auth is wired up
  const isAdmin = true;

  useEffect(() => {
    if (!appId) return;
    setLoading(true);
    apiClient
      .getApplication(Number(appId))
      .then((app) => {
        setApplication(app);
        if (app?.applicantType === ApplicantType.VOLUNTEER) {
          apiClient
            .getVolunteerInfo(Number(appId))
            .then(setVolunteerInfo)
            .catch(() => setError('Failed to load volunteer info'));
        } else if (app?.applicantType === ApplicantType.LEARNER) {
          apiClient
            .getLearnerInfo(Number(appId))
            .then(setLearnerInfo)
            .catch(() => setError('Failed to load learner info'));
        }
      })
      .catch(() => setError('Failed to load application'))
      .finally(() => setLoading(false));
  }, [appId]);

  const handleAvailabilityUpdate = (updated: AvailabilityFields) => {
    setApplication((prev) => (prev ? { ...prev, ...updated } : prev));
  };

  if (loading) {
    return (
      <div className="flex flex-row">
        <NavBar logo="BHCHP" userType={UserType.ADMIN} />
        <Box p="10" flex="1" display="flex" justifyContent="center" mt="20">
          <Spinner size="xl" />
        </Box>
      </div>
    );
  }

  if (
    error ||
    application === null ||
    (learnerInfo === null && volunteerInfo === null)
  ) {
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
      <NavBar logo="BHCHP" userType={UserType.ADMIN} />
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
        <ApplicationProfileHeader
          firstName={firstName}
          lastName={lastName}
          pronouns={pronouns}
          discipline={discipline}
          experienceType={application.experienceType || 'N/A'}
          email={application.email || 'N/A'}
          phone={application.phone || 'N/A'}
          over18={over18}
        />
        <SchoolAffiliationFrame
          schoolName={learnerInfo ? learnerInfo.school : 'N/A'}
          schoolDepartment={
            (learnerInfo && learnerInfo.schoolDepartment) || 'N/A'
          }
          license={(volunteerInfo && volunteerInfo.license) || 'N/A'}
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
            isAdmin={isAdmin}
            onUpdate={handleAvailabilityUpdate}
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
        <EmergencyContactFrame
          name={application.emergencyContactName}
          phone={application.emergencyContactPhone}
          relationship={application.emergencyContactRelationship}
        />
      </Box>
    </div>
  );
};

export default AdminViewApplication;
