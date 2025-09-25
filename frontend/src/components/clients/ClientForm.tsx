import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import clientService from '../../services/clientService';
import userService from '../../services/userService';
import type { ClientCreateData, ClientUpdateData } from '../../services/clientService';
import type { UserCreateData } from '../../services/userService';
import './ClientForm.css';

const ClientForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const [formData, setFormData] = useState({
    // Données client
    nom_c: '',
    prenom_c: '',
    tel_c: '',
    adresse_c: '',
    mail_c: '',
    // Données utilisateur (uniquement en création)
    nom_user: '',
    password: '',
    confirmPassword: ''
  });

  // Charger le client si on est en mode édition
  useEffect(() => {
    if (isEditing && id) {
      loadClient(parseInt(id));
    }
  }, [isEditing, id]);

  const loadClient = async (clientId: number) => {
    try {
      setLoading(true);
      const client = await clientService.getClientById(clientId);
      setFormData({
        nom_c: client.nom_c,
        prenom_c: client.prenom_c,
        tel_c: client.tel_c,
        adresse_c: client.adresse_c,
        mail_c: client.mail_c || '',
        // Les champs utilisateur ne sont pas modifiables en édition
        nom_user: '',
        password: '',
        confirmPassword: ''
      });
    } catch (error) {
      setError('Erreur lors du chargement du client');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Effacer l'erreur quand l'utilisateur modifie
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.nom_c.trim()) {
      setError('Le nom est requis');
      return;
    }
    if (!formData.prenom_c.trim()) {
      setError('Le prénom est requis');
      return;
    }
    if (!formData.tel_c.trim()) {
      setError('Le numéro de téléphone est requis');
      return;
    }
    if (!formData.adresse_c.trim()) {
      setError('L\'adresse est requise');
      return;
    }

    // Validation de l'email si fourni
    if (formData.mail_c && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.mail_c)) {
      setError('Format d\'email invalide');
      return;
    }

    // Validations supplémentaires pour la création
    if (!isEditing) {
      if (!formData.nom_user.trim()) {
        setError('Le nom d\'utilisateur est requis');
        return;
      }
      if (!formData.password.trim()) {
        setError('Le mot de passe est requis');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Les mots de passe ne correspondent pas');
        return;
      }
      if (formData.password.length < 6) {
        setError('Le mot de passe doit contenir au moins 6 caractères');
        return;
      }
    }

    try {
      setLoading(true);
      
      if (isEditing && id) {
        // Modification
        const updateData: ClientUpdateData = {
          nom_c: formData.nom_c,
          prenom_c: formData.prenom_c,
          tel_c: formData.tel_c,
          adresse_c: formData.adresse_c,
          mail_c: formData.mail_c || undefined
        };
        await clientService.updateClient(parseInt(id), updateData);
      } else {
        // Création - d'abord créer l'utilisateur, puis le client
        const userData: UserCreateData = {
          nom_user: formData.nom_user,
          password: formData.password,
          role: 'client'
        };
        
        const newUser = await userService.createUser(userData);
        
        const createData: ClientCreateData = {
          nom_c: formData.nom_c,
          prenom_c: formData.prenom_c,
          tel_c: formData.tel_c,
          adresse_c: formData.adresse_c,
          mail_c: formData.mail_c || undefined,
          user_id: newUser.id
        };
        await clientService.createClient(createData);
      }

      // Redirection vers la liste
      navigate('/clients');
    } catch (error: any) {
      let errorMessage = isEditing ? 'Erreur lors de la modification' : 'Erreur lors de la création';
      
      // Afficher l'erreur détaillée si disponible
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      console.error('Erreur complète:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/clients');
  };

  return (
    <div className="client-form-container">
      <div className="client-form-header">
        <div className="header-left">
          <Link to="/dashboard" className="btn btn-back">
            🏠 Accueil
          </Link>
          <h1>{isEditing ? 'Modifier le Client' : 'Nouveau Client'}</h1>
        </div>
        <button onClick={handleCancel} className="btn btn-secondary">
          ← Retour à la liste
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError('')} className="error-close">×</button>
        </div>
      )}

      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="nom_c">Nom *</label>
              <input
                type="text"
                id="nom_c"
                name="nom_c"
                value={formData.nom_c}
                onChange={handleInputChange}
                placeholder="Nom du client"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="prenom_c">Prénom *</label>
              <input
                type="text"
                id="prenom_c"
                name="prenom_c"
                value={formData.prenom_c}
                onChange={handleInputChange}
                placeholder="Prénom du client"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="tel_c">Téléphone *</label>
              <input
                type="tel"
                id="tel_c"
                name="tel_c"
                value={formData.tel_c}
                onChange={handleInputChange}
                placeholder="Numéro de téléphone"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="mail_c">Email</label>
              <input
                type="email"
                id="mail_c"
                name="mail_c"
                value={formData.mail_c}
                onChange={handleInputChange}
                placeholder="Adresse email (optionnel)"
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="adresse_c">Adresse *</label>
              <textarea
                id="adresse_c"
                name="adresse_c"
                value={formData.adresse_c}
                onChange={handleInputChange}
                placeholder="Adresse complète du client"
                rows={3}
                required
              />
            </div>

            {/* Champs utilisateur - uniquement en création */}
            {!isEditing && (
              <>
                <div className="form-group">
                  <label htmlFor="nom_user">Nom d'utilisateur *</label>
                  <input
                    type="text"
                    id="nom_user"
                    name="nom_user"
                    value={formData.nom_user}
                    onChange={handleInputChange}
                    placeholder="Nom d'utilisateur pour se connecter"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Mot de passe *</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Mot de passe (min. 6 caractères)"
                    minLength={6}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirmer le mot de passe *</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirmer le mot de passe"
                    minLength={6}
                    required
                  />
                </div>
              </>
            )}
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-secondary"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Traitement...' : (isEditing ? 'Modifier' : 'Créer')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientForm;
