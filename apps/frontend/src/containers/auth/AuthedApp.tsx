import { AmplifyAuthenticator, AmplifySignIn } from '@aws-amplify/ui-react';
import { Alert, Text, Flex, Center } from '@chakra-ui/react';
import * as React from 'react';
import { Outlet } from 'react-router-dom';
import Role from '../api/dtos/role';
import useAuth from '../hooks/useAuth';
import FullLogo from './header/FullLogo';
import LoadingSpinner from './LoadingSpinner';
import '../styles.css';
import LandingPageRedirect from './LandingPageRedirect';
import { roleMap } from '../constants';

interface AuthedAppProps {
  roles: Role[];
}

const AuthedApp: React.FC<AuthedAppProps> = ({ roles }) => {
  const [userLoading, userError, user] = useAuth();

  if (userLoading)
    return (
      <>
        <LoadingSpinner />
      </>
    );
  if (userError)
    return (
      <div id="error-page">
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
      </div>
    );
  if (!user)
    return (
      <Center w="100%" paddingLeft="150px" paddingRight="150px">
        <Flex gridColumnGap={30} alignItems="center">
          <Flex flexDirection="column" padding="10" alignItems="flex-center">
            <FullLogo />
            <Text margin={10}>
              This page hosts Wharton&apos;s Letter of Recommendation engine,
              which allows organizations to easily solicit letters of
              recommendation from supervisors in youth employment programs.
              <br />
              <br />
              If you are a program administrator interested in using the tool,
              please login or request access from a researcher or platform
              admin.
            </Text>
          </Flex>
          <Flex justifyContent="flex-start">
            <AmplifyAuthenticator usernameAlias="email">
              <AmplifySignIn usernameAlias="email" hideSignUp slot="sign-in" />
            </AmplifyAuthenticator>
          </Flex>
        </Flex>
      </Center>
    );
  if (!roles.includes(user.role))
    return <LandingPageRedirect rolesMap={roleMap} />;
  return (
    <>
      <Outlet />
    </>
  );
};

export default AuthedApp;
