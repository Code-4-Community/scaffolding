import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import './root.css';

const Root: React.FC = () => (
  <div className="root-shell">
    <Sidebar />
    <main className="root-main">
      <Outlet />
    </main>
  </div>
);

export default Root;
