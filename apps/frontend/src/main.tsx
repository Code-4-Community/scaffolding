import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { Amplify } from 'aws-amplify';
import App from './app';
import CognitoAuthConfig from '../../shared/aws-exports';
import { Authenticator } from '@aws-amplify/ui-react';
import { QueryClient, QueryClientProvider } from 'react-query';

Amplify.configure(CognitoAuthConfig);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Authenticator.Provider>
        <App />
      </Authenticator.Provider>
    </QueryClientProvider>
  </StrictMode>,
);
