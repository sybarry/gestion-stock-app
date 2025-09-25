import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { fournisseurService } from '../../services/fournisseurService';
import userService from '../../services/userService';
import type { CreateFournisseurData, UpdateFournisseurData } from '../../services/fournisseurService';
import type { UserCreateData } from '../../services/userService';
import './FournisseurForm.css';

const FournisseurForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const [formData, setFormData] = useState({
    // Données fournisseur
    nom_f: '',
    tel_f: '',
    adr_f: '',
    mail_f: '',
    // Données utilisateur (uniquement en création)
    nom_user: '',
    password: '',
    confirmPassword: ''
  });

  // Charger le fournisseur si on est en mode édition
  useEffect(() => {
    if (isEditing && id) {
      loadFournisseur(parseInt(id));
    }
  }, [isEditing, id]);

  const loadFournisseur = async (fournisseurId: number) => {
    try {
      setLoading(true);
      const fournisseur = await fournisseurService.getById(fournisseurId);
      setFormData({
        nom_f: fournisseur.nom_f,
        tel_f: fournisseur.tel_f,
        adr_f: fournisseur.adr_f,
        mail_f: fournisseur.mail_f || '',
        // Les champs utilisateur ne sont pas modifiables en édition
        nom_user: '',
        password: '',
        confirmPassword: ''
      });
    } catch (error) {
      setError('Erreur lors du chargement du fournisseur');
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
    if (!formData.nom_f.trim()) {
      setError('Le nom est requis');
      return;
    }
    if (!formData.tel_f.trim()) {
      setError('Le numéro de téléphone est requis');
      return;
    }
    if (!formData.adr_f.trim()) {
      setError('L\'adresse est requise');
      return;
    }

    // Validation de l'email si fourni
    if (formData.mail_f && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.mail_f)) {
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
        const updateData: UpdateFournisseurData = {
          nom_f: formData.nom_f,
          tel_f: formData.tel_f,
          adr_f: formData.adr_f,
          mail_f: formData.mail_f || undefined
        };
        await fournisseurService.update(parseInt(id), updateData);
      } else {
        // Création - d'abord créer l'utilisateur, puis le fournisseur
        const userData: UserCreateData = {
          nom_user: formData.nom_user,
          password: formData.password,
          role: 'fournisseur'
        };
        
        const newUser = await userService.createUser(userData);
        
        const createData: CreateFournisseurData = {
          nom_f: formData.nom_f,
          tel_f: formData.tel_f,
          adr_f: formData.adr_f,
          mail_f: formData.mail_f || undefined,
          user_id: newUser.id
        };
        await fournisseurService.create(createData);
      }

      // Redirection vers la liste
      navigate('/fournisseurs');
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
    navigate('/fournisseurs');
  };

  return (
    <div className="fournisseur-form-container">
      <div className="fournisseur-form-header">
        <div className="header-left">
          <Link to="/dashboard" className="btn btn-back">
            🏠 Accueil
          </Link>
          <h1>{isEditing ? 'Modifier le Fournisseur' : 'Nouveau Fournisseur'}</h1>
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
              <label htmlFor="nom_f">Nom *</label>
              <input
                type="text"
                id="nom_f"
                name="nom_f"
                value={formData.nom_f}
                onChange={handleInputChange}
                placeholder="Nom du fournisseur"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="tel_f">Téléphone *</label>
              <input
                type="tel"
                id="tel_f"
                name="tel_f"
                value={formData.tel_f}
                onChange={handleInputChange}
                placeholder="Numéro de téléphone"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="mail_f">Email</label>
              <input
                type="email"
                id="mail_f"
                name="mail_f"
                value={formData.mail_f}
                onChange={handleInputChange}
                placeholder="Adresse email (optionnel)"
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="adr_f">Adresse *</label>
              <textarea
                id="adr_f"
                name="adr_f"
                value={formData.adr_f}
                onChange={handleInputChange}
                placeholder="Adresse complète du fournisseur"
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

export default FournisseurForm;