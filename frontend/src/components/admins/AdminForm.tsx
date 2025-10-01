import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import adminService from '../../services/adminService';
import type { Admin } from '../../services/adminService';
import './AdminForm.css';

const AdminForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

    const [formData, setFormData] = useState<Omit<Admin, 'id' | 'datecreation_a'> & {
    nom_user: string;
    password: string;
    confirmPassword: string;
  }>({
    nom_a: '',
    prenom_a: '',
    tel_a: '',
    adr_a: '',
    mail_a: '',
    nom_user: '',
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Charger les données de l'admin à modifier
  useEffect(() => {
    if (isEdit && id) {
      loadAdmin(parseInt(id));
    }
  }, [id, isEdit]);

  const loadAdmin = async (adminId: number) => {
    try {
      setLoading(true);
      const admin = await adminService.getById(adminId);
      setFormData({
        nom_a: admin.nom_a,
        prenom_a: admin.prenom_a,
        tel_a: admin.tel_a,
        adr_a: admin.adr_a,
        mail_a: admin.mail_a,
        nom_user: admin.user?.nom_user || '',
        password: '', // Mot de passe vide pour les modifications
        confirmPassword: ''
      });
      setError('');
    } catch (error) {
      setError('Erreur lors du chargement des données de l\'administrateur');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation des champs obligatoires
    if (!formData.nom_a || !formData.prenom_a || !formData.tel_a || !formData.adr_a) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Validation des champs utilisateur pour les nouveaux admins
    if (!isEdit) {
      if (!formData.nom_user || !formData.password || !formData.confirmPassword) {
        setError('Veuillez remplir tous les champs utilisateur pour un nouvel administrateur');
        return;
      }

      if (formData.password.length < 6) {
        setError('Le mot de passe doit contenir au moins 6 caractères');
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Les mots de passe ne correspondent pas');
        return;
      }
    }

    try {
      setLoading(true);
      setError('');

      if (isEdit && id) {
        const updateData = {
          nom_a: formData.nom_a,
          prenom_a: formData.prenom_a,
          tel_a: formData.tel_a,
          adr_a: formData.adr_a,
          mail_a: formData.mail_a
        };
        await adminService.update(parseInt(id), updateData);
      } else {
        const adminToCreate = {
          nom_a: formData.nom_a,
          prenom_a: formData.prenom_a,
          tel_a: formData.tel_a,
          adr_a: formData.adr_a,
          mail_a: formData.mail_a,
          nom_user: formData.nom_user,
          password: formData.password,
          datecreation_a: new Date().toISOString()
        };
        await adminService.create(adminToCreate);
      }

      navigate('/admins');
    } catch (error) {
      setError(`Erreur lors de ${isEdit ? 'la modification' : 'la création'} de l'administrateur`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admins');
  };

  if (loading && isEdit) {
    return (
      <div className="admin-form-container">
        <div className="loading">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="admin-form-container">
      <div className="admin-form-header">
        <h1>{isEdit ? 'Modifier l\'Administrateur' : 'Nouvel Administrateur'}</h1>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError('')} className="error-close">×</button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label htmlFor="nom_a">Nom *</label>
          <input
            type="text"
            id="nom_a"
            name="nom_a"
            value={formData.nom_a}
            onChange={handleChange}
            required
            placeholder="Nom de l'administrateur"
          />
        </div>

        <div className="form-group">
          <label htmlFor="prenom_a">Prénom *</label>
          <input
            type="text"
            id="prenom_a"
            name="prenom_a"
            value={formData.prenom_a}
            onChange={handleChange}
            required
            placeholder="Prénom de l'administrateur"
          />
        </div>

        <div className="form-group">
          <label htmlFor="tel_a">Téléphone *</label>
          <input
            type="tel"
            id="tel_a"
            name="tel_a"
            value={formData.tel_a}
            onChange={handleChange}
            required
            placeholder="Numéro de téléphone"
          />
        </div>

        <div className="form-group">
          <label htmlFor="mail_a">Email</label>
          <input
            type="email"
            id="mail_a"
            name="mail_a"
            value={formData.mail_a}
            onChange={handleChange}
            placeholder="Adresse email (optionnel)"
          />
        </div>

        <div className="form-group">
          <label htmlFor="adr_a">Adresse *</label>
          <textarea
            id="adr_a"
            name="adr_a"
            value={formData.adr_a}
            onChange={handleChange}
            required
            placeholder="Adresse complète de l'administrateur"
            rows={3}
          />
        </div>

        {!isEdit && (
          <>
            <div className="form-group">
              <label htmlFor="nom_user">Nom d'utilisateur *</label>
              <input
                type="text"
                id="nom_user"
                name="nom_user"
                value={formData.nom_user}
                onChange={handleChange}
                required
                placeholder="Nom d'utilisateur pour se connecter"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Mot de passe *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Mot de passe (min. 6 caractères)"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmer le mot de passe *</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirmer le mot de passe"
              />
            </div>
          </>
        )}

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
            {loading ? 'Traitement...' : (isEdit ? 'Modifier' : 'Créer')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminForm;