import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import produitService from '../../services/produitService';
import { fournisseurService } from '../../services/fournisseurService';
import type { CreateProduitData, UpdateProduitData } from '../../services/produitService';
import type { Fournisseur } from '../../services/fournisseurService';
import './ProduitForm.css';

const ProduitForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [loadingFournisseurs, setLoadingFournisseurs] = useState(true);
  const [error, setError] = useState<string>('');
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);

  const [formData, setFormData] = useState({
    nom_p: '',
    fournisseur: 0,
    qte_p: 0,
    prix: 0
  });

  // Charger les fournisseurs au montage
  useEffect(() => {
    loadFournisseurs();
  }, []);

  // Charger le produit si on est en mode édition
  useEffect(() => {
    if (isEditing && id) {
      loadProduit(parseInt(id));
    }
  }, [isEditing, id]);

  const loadFournisseurs = async () => {
    try {
      const data = await fournisseurService.getAll();
      setFournisseurs(data);
    } catch (error) {
      setError('Erreur lors du chargement des fournisseurs');
      console.error(error);
    } finally {
      setLoadingFournisseurs(false);
    }
  };

  const loadProduit = async (produitId: number) => {
    try {
      setLoading(true);
      const produit = await produitService.getProduitById(produitId);
      setFormData({
        nom_p: produit.nom_p,
        fournisseur: produit.fournisseur.num_f,
        qte_p: produit.qte_p,
        prix: produit.prix
      });
    } catch (error) {
      setError('Erreur lors du chargement du produit');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'fournisseur' || name === 'qte_p' 
        ? parseInt(value) || 0 
        : name === 'prix'
        ? parseFloat(value) || 0
        : value
    }));
    
    // Effacer l'erreur quand l'utilisateur modifie
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.nom_p.trim()) {
      setError('Le nom du produit est requis');
      return;
    }
    if (formData.fournisseur === 0) {
      setError('Veuillez sélectionner un fournisseur');
      return;
    }
    if (formData.qte_p <= 0) {
      setError('La quantité doit être supérieure à 0');
      return;
    }
    if (formData.prix <= 0) {
      setError('Le prix doit être supérieur à 0');
      return;
    }

    try {
      setLoading(true);
      
      if (isEditing && id) {
        // Modification
        const updateData: UpdateProduitData = {
          nom_p: formData.nom_p,
          fournisseur_id: formData.fournisseur,
          qte_p: formData.qte_p,
          prix: formData.prix
        };
        await produitService.updateProduit(parseInt(id), updateData);
      } else {
        // Création
        const createData: CreateProduitData = {
          nom_p: formData.nom_p,
          fournisseur_id: formData.fournisseur,
          qte_p: formData.qte_p,
          prix: formData.prix
        };
        await produitService.createProduit(createData);
      }

      // Redirection vers la liste
      navigate('/produits');
    } catch (error) {
      setError(isEditing ? 'Erreur lors de la modification' : 'Erreur lors de la création');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/produits');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const total = formData.qte_p * formData.prix;

  if (loadingFournisseurs) {
    return (
      <div className="produit-form-container">
        <div className="loading">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="produit-form-container">
      <div className="produit-form-header">
        <div className="header-left">
          <Link to="/dashboard" className="btn btn-back">
            🏠 Accueil
          </Link>
          <h1>{isEditing ? 'Modifier le Produit' : 'Nouveau Produit'}</h1>
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
              <label htmlFor="nom_p">Nom du Produit *</label>
              <input
                type="text"
                id="nom_p"
                name="nom_p"
                value={formData.nom_p}
                onChange={handleInputChange}
                placeholder="Nom du produit"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="fournisseur">Fournisseur *</label>
              <select
                id="fournisseur"
                name="fournisseur"
                value={formData.fournisseur}
                onChange={handleInputChange}
                required
              >
                <option value={0}>Sélectionner un fournisseur</option>
                {fournisseurs.map((fournisseur) => (
                  <option key={fournisseur.num_f} value={fournisseur.num_f}>
                    {fournisseur.nom_f}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="qte_p">Quantité *</label>
              <input
                type="number"
                id="qte_p"
                name="qte_p"
                value={formData.qte_p}
                onChange={handleInputChange}
                min="1"
                placeholder="Quantité"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="prix">Prix Unitaire (€) *</label>
              <input
                type="number"
                id="prix"
                name="prix"
                value={formData.prix}
                onChange={handleInputChange}
                min="0.01"
                step="0.01"
                placeholder="Prix en euros"
                required
              />
              {formData.prix > 0 && (
                <small className="price-preview">
                  Prix affiché: {formatPrice(formData.prix)}
                </small>
              )}
            </div>
          </div>

          {total > 0 && (
            <div className="total-preview">
              <strong>Total estimé: {formatPrice(total)}</strong>
            </div>
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
              {loading ? 'Traitement...' : (isEditing ? 'Modifier' : 'Créer')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProduitForm;