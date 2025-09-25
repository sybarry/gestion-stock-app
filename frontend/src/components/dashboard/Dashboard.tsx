import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Gestion de Stock</h1>
        <div className="user-info">
          <span>Bienvenue, {user?.nom_user}</span>
          <span className="user-role">({user?.role})</span>
          <button onClick={handleLogout} className="logout-button">
            Déconnexion
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="welcome-card">
          <h2>Tableau de bord - StockManager</h2>
          <p>Bienvenue dans votre espace de gestion, {user?.nom_user} !</p>
          <div className="user-details">
            <p><strong>ID:</strong> {user?.id}</p>
            <p><strong>Nom d'utilisateur:</strong> {user?.nom_user}</p>
            <p><strong>Rôle:</strong> {user?.role}</p>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">8</div>
            <div className="stat-label">Fournisseurs</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">145</div>
            <div className="stat-label">Produits</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">32</div>
            <div className="stat-label">Commandes</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">67</div>
            <div className="stat-label">Clients</div>
          </div>
        </div>

        <div className="features-grid">
          <Link to="/fournisseurs" className="feature-card clickable">
            <div className="feature-icon">🏭</div>
            <h3>Fournisseurs</h3>
            <p>Maintenez vos relations fournisseurs et gérez vos approvisionnements</p>
          </Link>
          <Link to="/clients" className="feature-card clickable">
            <div className="feature-icon">👥</div>
            <h3>Clients</h3>
            <p>Gérez vos clients, leurs informations et leur historique d'achats</p>
          </Link>
          <Link to="/produits" className="feature-card clickable">
            <div className="feature-icon">📦</div>
            <h3>Produits</h3>
            <p>Cataloguez vos produits, gérez les stocks et suivez les mouvements</p>
          </Link>
          <Link to="/commandes" className="feature-card clickable">
            <div className="feature-icon">📋</div>
            <h3>Commandes</h3>
            <p>Traitez les commandes clients et suivez leur statut en temps réel</p>
          </Link>
          <Link to="/factures" className="feature-card clickable">
            <div className="feature-icon">🧾</div>
            <h3>Factures</h3>
            <p>Générez et gérez vos factures, suivez les paiements clients</p>
          </Link>
          {user?.role === 'admin' && (
            <div className="feature-card admin-only">
              <div className="feature-icon">⚙️</div>
              <h3>Administration</h3>
              <p>Gérez les utilisateurs, les permissions et les paramètres système</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;