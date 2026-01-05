import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';

import apiClient from '@api/apiClient';
import Root from '@containers/root';
import NotFound from '@containers/404';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Roor />,
    errorElement: <NotFound />,
  },
]);

export const App: React.FC = () => {
  useEffect(() => {
    apiClient.getHello().then((res) => console.log(res));
  }, []);

  return (
    <ChakraProvider value={defaultSystem}>
      <RouterProvider router={router} />
    </ChakraProvider>
  );
};

export default App;
