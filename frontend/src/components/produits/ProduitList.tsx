import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import produitService from '../../services/produitService';
import type { Produit } from '../../services/produitService';
import './ProduitList.css';

const ProduitList: React.FC = () => {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  // Charger les produits au montage du composant
  useEffect(() => {
    loadProduits();
  }, []);

  const loadProduits = async () => {
    try {
      setLoading(true);
      const data = await produitService.getAllProduits();
      setProduits(data);
      setError('');
    } catch (error) {
      setError('Erreur lors du chargement des produits');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await produitService.deleteProduit(id);
      setProduits(produits.filter(p => p.id !== id));
      setDeleteConfirm(null);
      setError('');
    } catch (error) {
      setError('Erreur lors de la suppression du produit');
      console.error(error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="produit-list-container">
        <div className="loading">Chargement des produits...</div>
      </div>
    );
  }

  return (
    <div className="produit-list-container">
      <div className="produit-list-header">
        <div className="header-left">
          <Link to="/dashboard" className="btn btn-back">
            🏠 Accueil
          </Link>
          <h1>Gestion des Produits</h1>
        </div>
        <Link to="/produits/nouveau" className="btn btn-primary">
          <span className="icon">+</span>
          Nouveau Produit
        </Link>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError('')} className="error-close">×</button>
        </div>
      )}

      <div className="produit-stats">
        <div className="stat-card">
          <h3>Total Produits</h3>
          <p>{produits.length}</p>
        </div>
        <div className="stat-card">
          <h3>Valeur Stock</h3>
          <p>{formatPrice(produits.reduce((sum, p) => sum + (p.total || 0), 0))}</p>
        </div>
      </div>

      <div className="produit-table-container">
        <table className="produit-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Fournisseur</th>
              <th>Quantité</th>
              <th>Prix Unitaire</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {produits.length === 0 ? (
              <tr>
                <td colSpan={7} className="no-data">
                  Aucun produit trouvé
                </td>
              </tr>
            ) : (
              produits.map((produit) => (
                <tr key={produit.id}>
                  <td>{produit.id}</td>
                  <td className="produit-name">{produit.nom_p}</td>
                  <td>{produit.fournisseur.nom_f}</td>
                  <td className="quantity">{produit.qte_p}</td>
                  <td className="price">{formatPrice(produit.prix)}</td>
                  <td className="total">{formatPrice(produit.total || 0)}</td>
                  <td className="actions">
                    <Link 
                      to={`/produits/${produit.id}/modifier`}
                      className="btn btn-sm btn-secondary"
                      title="Modifier"
                    >
                      ✏️
                    </Link>
                    <button
                      onClick={() => setDeleteConfirm(produit.id!)}
                      className="btn btn-sm btn-danger"
                      title="Supprimer"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de confirmation de suppression */}
      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirmer la suppression</h3>
            <p>
              Êtes-vous sûr de vouloir supprimer le produit "{produits.find(p => p.id === deleteConfirm)?.nom_p}" ?
            </p>
            <div className="modal-actions">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="btn btn-secondary"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="btn btn-danger"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProduitList;