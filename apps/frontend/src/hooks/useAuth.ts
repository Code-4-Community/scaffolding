import { useEffect } from 'react';
import User from '@api/dtos/user.dto';
import * as Sentry from '@sentry/react';
import apiClient from '@api/apiClient';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useQuery } from 'react-query';

export default function useAuth(): [boolean, boolean, User | undefined] {
  // get user and authStatus from authenticator hook
  const { user, authStatus } = useAuthenticator((context) => [
    context.user,
    context.authStatus,
  ]);

  // sentry user tracking
  useEffect(() => {
    if (authStatus === 'authenticated') {
      Sentry.setUser(user);
    } else {
      Sentry.setUser(null);
    }
  }, [user, authStatus]);

  const isUserAuthenticated = authStatus === 'authenticated';

  const { isLoading, isError, data } = useQuery({
    queryKey: ['auth', user?.userId],
    queryFn: () => apiClient.getMe(),
    enabled: isUserAuthenticated && !!user,
  });

  return [
    isLoading || authStatus === 'configuring',
    isError,
    isUserAuthenticated ? data : undefined,
  ];
}
