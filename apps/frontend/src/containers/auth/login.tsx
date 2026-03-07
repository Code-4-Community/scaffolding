import React from 'react';
import { Authenticator, View, Image, Heading, Text } from '@aws-amplify/ui-react';
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
          Welcome Back
        </Text>
        <Heading
          level={1}
          fontSize="24px"
          fontWeight="700"
          fontFamily="var(--font-heading)"
          color="#000000"
          marginTop="small"
        >
          Log In
        </Heading>
      </View>
    );
  }
};

const Login: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-container">
      <Authenticator
        hideSignUp
        initialState="signIn"
        components={components}
        loginMechanisms={['email', 'phone_number', 'username']} 
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

export default Login;
