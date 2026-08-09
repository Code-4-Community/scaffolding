import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { Authenticator } from '@aws-amplify/ui-react';
import { configureAmplify, isAuthEnabled } from './auth/auth.config';
import App from './app';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

// Configure amplify with cognito (Only runs if the environment variables are set in the .env file)
configureAmplify();

// Mirrors the backend's CognitoModule: running without auth is a normal local
// workflow, but in a production build it means the login gate is gone entirely,
// so make that loud. See apps/backend/src/aws/cognito/README.md to fail hard
// (throw) here instead of merely logging.
if (!isAuthEnabled() && import.meta.env.PROD) {
  console.error(
    'Cognito auth disabled: VITE_COGNITO_* env vars missing at build time. ' +
      'The app is rendering without a login gate.',
  );
}

root.render(
  isAuthEnabled() ? (
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
