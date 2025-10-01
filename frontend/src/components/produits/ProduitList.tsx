import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import produitService from '../../services/produitService';
import type { Produit } from '../../services/produitService';
import PasswordConfirmModal from '../common/PasswordConfirmModal';
import { printList } from '../../utils/printUtils';
import '../../styles/print-buttons.css';
import './ProduitList.css';

const ProduitList: React.FC = () => {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [modalData, setModalData] = useState<{
    isOpen: boolean;
    action: 'delete' | 'modify';
    produitId: number | null;
    produitName: string;
  }>({
    isOpen: false,
    action: 'delete',
    produitId: null,
    produitName: ''
  });

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

  const handleDeleteClick = (produit: Produit) => {
    setModalData({
      isOpen: true,
      action: 'delete',
      produitId: produit.id ?? null,
      produitName: produit.nom_p
    });
  };

  const handleModifyClick = (produit: Produit) => {
    setModalData({
      isOpen: true,
      action: 'modify',
      produitId: produit.id ?? null,
      produitName: produit.nom_p
    });
  };

  const handleModalClose = () => {
    setModalData({
      isOpen: false,
      action: 'delete',
      produitId: null,
      produitName: ''
    });
  };

  const handleModalConfirm = async () => {
    if (!modalData.produitId) return;

    try {
      if (modalData.action === 'delete') {
        await produitService.deleteProduit(modalData.produitId);
        setProduits(produits.filter(p => p.id !== modalData.produitId));
        setError('');
      } else if (modalData.action === 'modify') {
        // Rediriger vers la page de modification
        window.location.href = `/produits/${modalData.produitId}/modifier`;
      }
    } catch (error) {
      setError(`Erreur lors de la ${modalData.action === 'delete' ? 'suppression' : 'modification'} du produit`);
      console.error(error);
    }
  };

    const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price); // Affichage direct sans conversion
  };

  const handlePrintList = () => {
    const columns = [
      { key: 'id', label: 'ID' },
      { key: 'nom_p', label: 'Nom' },
      { key: 'fournisseur.nom_f', label: 'Fournisseur' },
      { key: 'qte_p', label: 'Quantité' },
      { key: 'prix', label: 'Prix unitaire', format: (price: number) => formatPrice(price) },
      { key: 'total', label: 'Total', format: (total: number) => formatPrice(total || 0) }
    ];
    
    printList('Liste des Produits', produits, columns);
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
        <div className="header-actions">
          <button onClick={handlePrintList} className="btn btn-print">
            🖨️ Imprimer la liste
          </button>
          <Link to="/produits/nouveau" className="btn btn-primary">
            <span className="icon">+</span>
            Nouveau Produit
          </Link>
        </div>
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
                    <button
                      onClick={() => handleModifyClick(produit)}
                      className="btn btn-sm btn-secondary"
                      title="Modifier"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteClick(produit)}
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

      {/* Modal de confirmation avec mot de passe */}
      <PasswordConfirmModal
        isOpen={modalData.isOpen}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
        title={modalData.action === 'delete' ? 'Confirmer la suppression' : 'Confirmer la modification'}
        message={`Êtes-vous sûr de vouloir ${modalData.action === 'delete' ? 'supprimer' : 'modifier'} le produit "${modalData.produitName}" ?`}
        actionType={modalData.action}
      />
    </div>
  );
};

export default ProduitList;