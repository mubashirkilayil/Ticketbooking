import { Navigate, Outlet } from 'react-router-dom';

function PrivateRoutes({ user, token, role }) {
  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to={user.role === 'ORGANIZER' ? '/organizer' : '/events'} replace />;
  }

  return <Outlet />;
}

export default PrivateRoutes;
