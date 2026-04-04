import { useQuery } from 'react-query';
import apiClient from '@api/apiClient';
import useAuth from '../../hooks/useAuth';
import Role from '@api/dtos/role';
import User from '@api/dtos/user.dto';
import './people.css';

const PersonRow: React.FC<{ user: User }> = ({ user }) => (
  <div className="people-row">
    <div className="people-row-left">
      <div className="people-avatar">
        {user.firstName.charAt(0).toUpperCase()}
        {user.lastName.charAt(0).toUpperCase()}
      </div>
      <div className="people-info">
        <span className="people-name">
          {user.firstName} {user.lastName}
        </span>
        <span className="people-title">{user.title}</span>
      </div>
    </div>
    <span className="people-role">{user.role}</span>
  </div>
);

const People: React.FC = () => {
  const [, , currentUser] = useAuth();

  const {
    isLoading,
    isError,
    data: users,
  } = useQuery({
    queryKey: ['users'],
    queryFn: () => apiClient.getUsers(),
  });

  return (
    <div className="people-wrapper">
      <div className="people-header">
        <h1 className="people-title-heading">People</h1>
        {/* todo: implement the modal button (issue#123) */}
        {currentUser?.role === Role.ADMIN && (
          <button type="button" className="people-create-btn">
            + Create User
          </button>
        )}
      </div>

      <div className="people-table">
        <div className="people-table-header">
          <span className="people-col-name">Name</span>
          <span className="people-col-role">Role</span>
        </div>

        {isLoading && <div className="people-state-message">Loading...</div>}
        {isError && (
          <div className="people-state-message">Failed to load users.</div>
        )}
        {!isLoading && !isError && users?.length === 0 && (
          <div className="people-state-message">No users found.</div>
        )}
        {!isLoading &&
          !isError &&
          users?.map((user) => <PersonRow key={user.id} user={user} />)}
      </div>
    </div>
  );
};

export default People;
