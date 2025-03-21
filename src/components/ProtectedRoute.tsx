
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // If still loading auth state, show nothing (or could show a loading indicator)
  if (loading) {
    return null;
  }

  // If not authenticated, redirect to sign-in page, but save the attempted URL
  if (!isAuthenticated) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  // If authenticated, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
