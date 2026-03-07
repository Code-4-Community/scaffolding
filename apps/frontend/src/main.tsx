import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { Amplify } from 'aws-amplify';
import App from './app';
import CognitoAuthConfig from './aws-exports';

Amplify.configure(CognitoAuthConfig);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
