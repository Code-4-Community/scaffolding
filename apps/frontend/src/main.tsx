import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import AdminHomePage from 'admin/AdminHomePage';
import { ChakraProvider, createSystem, defaultConfig } from '@chakra-ui/react';

import App from './app';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
const system = createSystem(defaultConfig);
root.render(
  <StrictMode>
    <ChakraProvider value={system}>
      <AdminHomePage />
    </ChakraProvider>
  </StrictMode>,
);
