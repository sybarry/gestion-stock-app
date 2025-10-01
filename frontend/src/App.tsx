import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginForm from './components/auth/LoginForm';
import Dashboard from './components/dashboard/Dashboard';
import ProduitList from './components/produits/ProduitList';
import ProduitForm from './components/produits/ProduitForm';
import CommandeList from './components/commandes/CommandeList';
import CommandeForm from './components/commandes/CommandeForm';
import ClientList from './components/clients/ClientList';
import ClientForm from './components/clients/ClientForm';
import FournisseurList from './components/fournisseurs/FournisseurList';
import FournisseurForm from './components/fournisseurs/FournisseurForm';
import AdminList from './components/admins/AdminList';
import AdminForm from './components/admins/AdminForm';
import FactureClient from './components/factures/FactureClient';
import ProtectedRoute from './components/auth/ProtectedRoute';
import './App.css';

// Composant pour gérer la redirection automatique
const AppRouter: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Chargement...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginForm />} 
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/produits"
        element={
          <ProtectedRoute>
            <ProduitList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/produits/nouveau"
        element={
          <ProtectedRoute>
            <ProduitForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/produits/:id/modifier"
        element={
          <ProtectedRoute>
            <ProduitForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/commandes"
        element={
          <ProtectedRoute>
            <CommandeList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/commandes/nouveau"
        element={
          <ProtectedRoute>
            <CommandeForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/commandes/:id/modifier"
        element={
          <ProtectedRoute>
            <CommandeForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/clients"
        element={
          <ProtectedRoute>
            <ClientList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/clients/nouveau"
        element={
          <ProtectedRoute>
            <ClientForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/clients/:id/modifier"
        element={
          <ProtectedRoute>
            <ClientForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/fournisseurs"
        element={
          <ProtectedRoute>
            <FournisseurList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/fournisseurs/nouveau"
        element={
          <ProtectedRoute>
            <FournisseurForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/fournisseurs/:id/modifier"
        element={
          <ProtectedRoute>
            <FournisseurForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admins"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admins/nouveau"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admins/:id/modifier"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/factures"
        element={
          <ProtectedRoute>
            <FactureClient />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/" 
        element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} 
      />
      <Route 
        path="*" 
        element={<Navigate to="/" replace />} 
      />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <AppRouter />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
