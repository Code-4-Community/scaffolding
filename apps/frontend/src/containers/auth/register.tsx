import React from 'react';
import { Authenticator, useAuthenticator, View, Image, Heading, Text, Button } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import './auth.css';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/icons/826-boston-logo.png';

const components = {
  Header() {
    return (
      <View textAlign="center" padding="large">
        <Image
          alt="826 Boston Logo"
          src={logo}
          height="40px"
          marginBottom="medium"
        />
        <Text
          variation="primary"
          fontSize="14px"
          color="var(--neutral-400)"
          fontFamily="var(--font-body)"
        >
          Welcome to 826 Boston!
        </Text>
        <Heading
          level={1}
          fontSize="24px"
          fontWeight="700"
          fontFamily="var(--font-heading)"
          color="#000000"
          marginTop="small"
        >
          Create your account
        </Heading>
      </View>
    );
  },
  Footer() {
    const { toSignIn } = useAuthenticator();
    return (
      <View textAlign="center" padding="large" marginTop="medium">
        <Text fontSize="14px" color="var(--neutral-400)">
          Have an account?{' '}
          <Button
            variation="link"
            onClick={toSignIn}
            color="#007B83"
            fontWeight="600"
            fontSize="14px"
            style={{ padding: 0, minWidth: 'auto' }}
          >
            Log in here.
          </Button>
        </Text>
      </View>
    );
  },
};

const Register: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-container">
      <Authenticator
        initialState="signUp"
        components={components}
        loginMechanisms={['email', 'phone_number', 'username']}
        signUpAttributes={['email', 'phone_number']} 
        // Note: 'username' is implicit in Amplify sign up if not alias
      >
        {({ user }) => {
           if (user) {
             setTimeout(() => navigate('/'), 0);
             return <div>Loading...</div>;
          }
          return <></>;
        }}
      </Authenticator>
    </div>
  );
};

export default Register;
