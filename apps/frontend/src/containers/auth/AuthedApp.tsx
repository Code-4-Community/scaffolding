import Role from '@api/dtos/role';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

interface AuthedAppProps {
  roles: Role[];
}

const AuthedApp: React.FC<AuthedAppProps> = ({ roles }) => {
  const [userLoading, userError, user] = useAuth();

  if (userLoading)
    // TODO: change this to loading page
    return (
      <div>
        <h1>Loading</h1>
      </div>
    );
  if (userError)
    // TODO: change error page
    return (
      <div id="error-page">
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
      </div>
    );
  if (!user || !roles.includes(user.role))
    return <Navigate to="/archive/published" replace />;

  return <Outlet />;
};

export default AuthedApp;
