import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'client' | 'fournisseur' | 'admin' | 'user';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  // Afficher un loading pendant la vérification de l'auth
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Chargement...</div>
      </div>
    );
  }

  // Rediriger vers login si pas authentifié
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Vérifier le rôle si requis
  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="access-denied">
        <h2>Accès refusé</h2>
        <p>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
        <p>Rôle requis: {requiredRole}, votre rôle: {user.role}</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;