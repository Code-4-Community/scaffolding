import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './styles.css';
import apiClient from '@api/apiClient';
import Root from '@containers/root';
import NotFound from '@containers/404';
import ArchivedPublications from '@containers/archived-publications';
import PublicationView from '@containers/archived-publications/individual-publication/publication-view';
import Login from '@containers/auth/login';
import AuthedApp from '@containers/auth/AuthedApp';
import ProtectedRoute from '@containers/auth/ProtectedRoute';
import People from '@containers/people';
import Role from '@api/dtos/role';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <NotFound />,
    children: [
      // public routes
      { index: true, element: <ArchivedPublications /> },
      {
        // archive
        path: 'archive',
        children: [
          { index: true, element: <ArchivedPublications /> },
          {
            path: 'publication/:id?',
            element: <PublicationView />,
          },
        ],
      },
      // admin and volunteer routes
      {
        element: <ProtectedRoute roles={[Role.ADMIN, Role.VOLUNTEER]} />,
        children: [{ path: 'people', element: <People /> }],
      },
      {
        element: <AuthedApp roles={[Role.ADMIN, Role.VOLUNTEER]} />,
        children: [
          {
            path: 'test',
            element: <NotFound />,
          },
          /*
          TODO: set default page for admins/volunteers to projects page?
          {index: true,
            element: <Projects />
          }*/
        ],
      },

      // TODO: admin routes (ex. adding admin/volunteers)
      {
        path: 'admin',
        element: <AuthedApp roles={[Role.ADMIN]} />,
        children: [
          /*
          TODO: set default page for admins
          */
        ],
      },
    ],
  },
  { path: 'login', element: <Login /> },
]);

export const App: React.FC = () => {
  useEffect(() => {
    apiClient.getHello().then((res) => console.log(res));
  }, []);

  return <RouterProvider router={router} />;
};

export default App;
