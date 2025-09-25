import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import type { LoginCredentials } from '../../services/authService';
import './LoginForm.css';

const LoginForm: React.FC = () => {
  const { login, isLoading } = useAuth();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    nom_user: '',
    password: '',
  });
  const [error, setError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    // Effacer l'erreur quand l'utilisateur tape
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!credentials.nom_user || !credentials.password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    try {
      await login(credentials);
      // La redirection sera gérée par le composant parent
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erreur de connexion');
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="login-brand">
          <h1>SAIKOUZ TECH</h1>
          <p>Votre solution complète de gestion de stock</p>
        </div>
        
        <div className="login-features">
          <div className="feature-item">
            <div className="feature-icon">📦</div>
            <span>Gestion complète des produits</span>
          </div>
          <div className="feature-item">
            <div className="feature-icon">👥</div>
            <span>Clients et fournisseurs</span>
          </div>
          <div className="feature-item">
            <div className="feature-icon">📊</div>
            <span>Commandes et statistiques</span>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🔐</div>
            <span>Sécurisé et fiable</span>
          </div>
        </div>
      </div>
      
      <div className="login-right">
        <div className="login-card">
          <h2 className="login-title">Connexion</h2>
          <p className="login-subtitle">Accédez à votre espace de gestion</p>
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="nom_user">Nom d'utilisateur</label>
              <input
                type="text"
                id="nom_user"
                name="nom_user"
                value={credentials.nom_user}
                onChange={handleChange}
                placeholder="Entrez votre nom d'utilisateur"
                disabled={isLoading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Mot de passe</label>
              <input
                type="password"
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="Entrez votre mot de passe"
                disabled={isLoading}
                required
              />
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <div className="login-footer">
            <p>Pas encore de compte ? <a href="/register">S'inscrire</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;