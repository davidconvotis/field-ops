import { Outlet } from 'react-router-dom';
import DispatcherSidebar from '../components/DispatcherSidebar.jsx';

export default function DispatcherLayout() {
  return (
    <div className="flex min-h-screen">
      <DispatcherSidebar />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
