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
import Role from '@api/dtos/role';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <NotFound />,
    children: [
      // public routes
      { index: true, element: <ArchivedPublications mode="archive" /> },
      {
        // archive
        path: 'archive',
        children: [
          { index: true, element: <ArchivedPublications mode="archive" /> },
          {
            path: 'publication/:id?',
            element: <PublicationView />,
          },
        ],
      },
      // admin and volunteer routes
      {
        element: <AuthedApp roles={[Role.ADMIN, Role.VOLUNTEER]} />,
        children: [
          {
            path: 'projects/publication/:tab',
            element: <ArchivedPublications mode="projects" />,
          },
          {
            path: 'projects/publication/details/:id?',
            element: <PublicationView />,
          },
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
