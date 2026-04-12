import { Box, Spinner } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

import { getCurrentSessionUserType } from './current-session-user-type';
import { UserType } from '../api/types';

/**
 * Resolves the current user's app role and redirects to the corresponding
 * role-specific landing route.
 */
const RoleHomeRedirect: React.FC = () => {
  const [to, setTo] = useState<string | null>(null);

  useEffect(() => {
    getCurrentSessionUserType()
      .then((userType) => {
        if (!userType) {
          setTo('/login');
          return;
        }
        setTo(
          userType === UserType.ADMIN
            ? '/admin/landing'
            : '/candidate/view-application',
        );
      })
      .catch(() => setTo('/login'));
  }, []);

  if (!to) {
    return (
      <Box
        display="flex"
        minH="100vh"
        alignItems="center"
        justifyContent="center"
      >
        <Spinner size="xl" />
      </Box>
    );
  }

  return <Navigate to={to} replace />;
};

export default RoleHomeRedirect;
