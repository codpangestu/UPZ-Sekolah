import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { ROLE_DASHBOARD_ROUTES, type UserRole } from '../../types';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, role, isLoading } = useAuthStore();
  const location = useLocation();

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="animate-spin text-[#28A71A]" />
          <span
            className="text-sm text-text-gray"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Memuat...
          </span>
        </div>
      </div>
    );
  }

  // Not authenticated → redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role not allowed → redirect to appropriate dashboard
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to={ROLE_DASHBOARD_ROUTES[role]} replace />;
  }

  return <>{children}</>;
}
