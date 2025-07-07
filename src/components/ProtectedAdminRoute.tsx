
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
  requiredRole?: 'super_admin' | 'admin';
}

const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({ 
  children, 
  requiredRole = 'admin' 
}) => {
  const { admin, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#272727]">
        <div className="text-white">Cargando...</div>
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/admin-login" replace />;
  }

  if (requiredRole === 'super_admin' && admin.role !== 'super_admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#272727]">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">Acceso Denegado</h1>
          <p>No tienes permisos para acceder a esta sección.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedAdminRoute;
