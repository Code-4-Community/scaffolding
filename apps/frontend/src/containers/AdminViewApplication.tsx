import NavBar from '@components/NavBar/NavBar';
import { useParams } from 'react-router-dom';
import { Box, Heading, Spinner, Text } from '@chakra-ui/react';
import AvailabilityTable from '@components/AvailabilityTable';
import { useEffect, useState } from 'react';
import apiClient, { Application, AvailabilityFields } from '@api/apiClient';
import {
  ApplicantType,
  AppStatus,
  DISCIPLINE_VALUES,
  ExperienceType,
  InterestArea,
} from '@api/types';

const dummyApplication: Application = {
  appId: 1,
  appStatus: AppStatus.APP_SUBMITTED,
  mondayAvailability: '12pm and on every other week',
  tuesdayAvailability: 'approximately 10am-3pm',
  wednesdayAvailability: 'no availability',
  thursdayAvailability: 'maybe before 10am',
  fridayAvailability: 'Sometime between 4-6',
  saturdayAvailability: 'no availability',
  experienceType: ExperienceType.BS,
  interest: [InterestArea.WOMENS_HEALTH],
  license: '',
  applicantType: ApplicantType.LEARNER,
  phone: '123-456-7890',
  email: 'test@example.com',
  discipline: DISCIPLINE_VALUES.RN,
  referred: false,
  weeklyHours: 20,
  pronouns: 'they/them',
  nonEnglishLangs: 'some french, native spanish speaker',
  desiredExperience:
    'I want to give back to the boston community and learn to talk better with patients',
  resume: 'janedoe_resume_2_6_2026.pdf',
  coverLetter: 'janedoe_coverLetter_2_6_2026.pdf',
  emergencyContactName: 'Jane Doe',
  emergencyContactPhone: '111-111-1111',
  emergencyContactRelationship: 'Mother',
  heardAboutFrom: [],
};

const AdminViewApplication: React.FC = () => {
  const { appId } = useParams<{ appId: string }>();
  console.log(appId);
  const [application, setApplication] = useState<Application | null>(
    dummyApplication,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // TODO: derive from actual auth state once auth is wired up
  const isAdmin = true;

  useEffect(() => {
    if (!appId) return;
    // setLoading(true);
    // apiClient
    //     .getApplication(Number(appId))
    //     .then(setApplication)
    //     .catch(() => setError('Failed to load application'))
    //     .finally(() => setLoading(false));
  }, [appId]);

  const handleAvailabilityUpdate = (updated: AvailabilityFields) => {
    setApplication((prev) => (prev ? { ...prev, ...updated } : prev));
  };

  if (loading) {
    return (
      <div className="flex flex-row">
        <NavBar logo="BHCHP" />
        <Box p="10" flex="1" display="flex" justifyContent="center" mt="20">
          <Spinner size="xl" />
        </Box>
      </div>
    );
  }

  if (error || application === null) {
    return (
      <div className="flex flex-row">
        <NavBar logo="BHCHP" />
        <Box p="10" flex="1">
          <Text color="red.500">{error ?? 'Application not found'}</Text>
        </Box>
      </div>
    );
  }

  return (
    <div className="flex flex-row">
      <NavBar logo="BHCHP" />
      <Box id="main-content" p="10" flex="1">
        <Heading size="lg" mb="6">
          Applicant Details
        </Heading>

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
      </Box>
    </div>
  );
};

export default AdminViewApplication;
