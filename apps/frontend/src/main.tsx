import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { Amplify } from 'aws-amplify';

import App from './app';

// TODO: Replace with actual configuration or import from aws-exports.js
// Ryaken UPDATE THIS
const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: 'us-east-1_NMroTDphS', // placeholder
      userPoolClientId: '65a4hrhh9pp1j3dosab164vns3', // placeholder
      loginWith: {
        email: true,
      }
    }
  }
};

Amplify.configure(amplifyConfig);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
