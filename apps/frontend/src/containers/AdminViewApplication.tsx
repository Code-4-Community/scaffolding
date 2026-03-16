import NavBar from '@components/NavBar/NavBar';
import { useParams } from 'react-router-dom';
import { Box, Heading, Spinner, Text } from '@chakra-ui/react';
import AvailabilityTable from '@components/AvailabilityTable';
import { useEffect, useState } from 'react';
import apiClient, { Application, AvailabilityFields } from '@api/apiClient';

const AdminViewApplication: React.FC = () => {
  const { appId } = useParams<{ appId: string }>();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // TODO: derive from actual auth state once auth is wired up
  const isAdmin = true;

  useEffect(() => {
    if (!appId) return;
    setLoading(true);
    apiClient
      .getApplication(Number(appId))
      .then(setApplication)
      .catch(() => setError('Failed to load application'))
      .finally(() => setLoading(false));
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

  if (error || !application) {
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
