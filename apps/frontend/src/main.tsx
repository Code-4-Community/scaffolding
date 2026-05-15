import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { Authenticator } from '@aws-amplify/ui-react';
import {
  configureAmplify,
  cognitoInformationPresent,
} from '../auth/auth.config';
import App from './app';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

// Configure amplify with cognito (Only runs if the environment variables are set in the .env file)
configureAmplify();

root.render(
  cognitoInformationPresent ? (
    <Authenticator>
      <StrictMode>
        <App />
      </StrictMode>
    </Authenticator>
  ) : (
    <StrictMode>
      <App />
    </StrictMode>
  ),
);
