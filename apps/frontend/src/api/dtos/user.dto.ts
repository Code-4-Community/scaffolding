import Role from './role';

interface User {
  id: number;

  firstName: string;

  lastName: string;

  email: string;

  role: Role;
}

export default User;
