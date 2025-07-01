import { Navigate, useLocation } from 'react-router-dom';
import useAuthCheck from './useAuthCheck';

const ProtectedRoute = ({ children }) => {
  const { loading, authenticated } = useAuthCheck();
  const location = useLocation(); // 🔑 for redirecting back

  if (loading) return <div className="text-white text-center">Checking authentication...</div>;

  return authenticated ? children : <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;
