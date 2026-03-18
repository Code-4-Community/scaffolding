import { useEffect } from 'react';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';

import './styles.css';
import apiClient from '@api/apiClient';
import Root from '@containers/root';
import NotFound from '@containers/404';
import Test from '@containers/test';
import ArchivedPublications from '@containers/archived-publications';
import PublicationView from '@containers/archived-publications/individual-publication/publication-view';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Navigate to="/archive" replace />,
      },
      {
        path: 'archive',
        element: <ArchivedPublications mode="archive" />,
      },
      {
        path: 'archive/publication/:id?',
        element: <PublicationView />,
      },
      {
        path: 'projects/publication/:tab',
        element: <ArchivedPublications mode="projects" />,
      },
      {
        path: 'projects/publication/details/:id?',
        element: <PublicationView />,
      },
    ],
  },
  {
    path: '/test',
    element: <Test />,
  },
]);

export const App: React.FC = () => {
  useEffect(() => {
    apiClient.getHello().then((res) => console.log(res));
  }, []);

  return <RouterProvider router={router} />;
};

export default App;
