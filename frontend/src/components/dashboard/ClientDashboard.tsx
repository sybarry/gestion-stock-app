import React, { useState, useEffect } from 'react';
import produitService from '../../services/produitService';
import { fournisseurService } from '../../services/fournisseurService';
import { commandeService } from '../../services/commandeService';
import { clientService } from '../../services/clientService';
import type { Produit } from '../../services/produitService';
import type { Fournisseur } from '../../services/fournisseurService';
import type { Client } from '../../services/clientService';
import { useAuth } from '../../context/AuthContext';
import './ClientDashboard.css';

const ClientDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [produits, setProduits] = useState<Produit[]>([]);
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);
  const [currentClient, setCurrentClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [creatingOrder, setCreatingOrder] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [produitsData, fournisseursData, clientsData] = await Promise.all([
        produitService.getAllProduits(),
        fournisseurService.getAll(),
        clientService.getAllClients()
      ]);
      setProduits(produitsData);
      setFournisseurs(fournisseursData);
      
      // Trouver le client connecté basé sur l'user ID
      if (user) {
        const client = clientsData.find(c => c.user?.id === user.id);
        setCurrentClient(client || null);
      }
      
      setError('');
    } catch (error) {
      setError('Erreur lors du chargement des données');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getFournisseurName = (fournisseur: any) => {
    if (typeof fournisseur === 'string') {
      const fournisseurId = parseInt(fournisseur.split('/').pop() || '0');
      const found = fournisseurs.find(f => f.num_f === fournisseurId);
      return found ? found.nom_f : 'Fournisseur inconnu';
    }
    return fournisseur?.nom_f || 'Fournisseur inconnu';
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

    const createOrder = async (produitId: number) => {
    try {
      setCreatingOrder(produitId);
      setError('');
      setSuccessMessage('');

      if (!currentClient) {
        throw new Error('Aucun client connecté trouvé');
      }

      // Créer la commande avec une quantité par défaut de 1
      const commandeData = {
        client_id: currentClient.num_c, // Utiliser l'ID du client (num_c)
        produit_id: produitId,
        qte_c: 1
      };

      console.log('Données de commande:', commandeData);
      await commandeService.createCommande(commandeData);
      setSuccessMessage('Commande créée avec succès !');

      // Effacer le message de succès après 3 secondes
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);

    } catch (error) {
      console.error('Erreur lors de la création de la commande:', error);
      setError(`Erreur lors de la création de la commande: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setCreatingOrder(null);
    }
  };

  const filteredProduits = produits.filter(produit =>
    produit.nom_p.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getFournisseurName(produit.fournisseur).toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="client-dashboard-container">
        <div className="loading">Chargement des produits...</div>
      </div>
    );
  }

  return (
    <div className="client-dashboard-container">
      <header className="client-header">
        <div className="header-content">
          <h1>Catalogue des Produits</h1>
          <div className="user-info">
            <span>Bienvenue, {user?.nom_user}</span>
            <button onClick={logout} className="btn btn-logout">
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError('')} className="error-close">×</button>
        </div>
      )}

      {successMessage && (
        <div className="success-message">
          {successMessage}
          <button onClick={() => setSuccessMessage('')} className="success-close">×</button>
        </div>
      )}

      <div className="client-content">
        <div className="search-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Rechercher un produit ou fournisseur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>

        <div className="products-stats">
          <div className="stat-card">
            <h3>Produits disponibles</h3>
            <p className="stat-number">{filteredProduits.length}</p>
          </div>
          <div className="stat-card">
            <h3>Total en stock</h3>
            <p className="stat-number">{filteredProduits.reduce((sum, p) => sum + p.qte_p, 0)}</p>
          </div>
          <div className="stat-card">
            <h3>Fournisseurs</h3>
            <p className="stat-number">{fournisseurs.length}</p>
          </div>
        </div>

        <div className="products-grid">
          {filteredProduits.length === 0 ? (
            <div className="no-products">
              {searchTerm ? 'Aucun produit trouvé pour votre recherche' : 'Aucun produit disponible'}
            </div>
          ) : (
            filteredProduits.map((produit) => (
              <div key={produit.id} className="product-card">
                <div className="product-header">
                  <h3 className="product-name">{produit.nom_p}</h3>
                  <span className={`stock-badge ${produit.qte_p > 10 ? 'in-stock' : produit.qte_p > 0 ? 'low-stock' : 'out-of-stock'}`}>
                    {produit.qte_p > 0 ? `${produit.qte_p} en stock` : 'Rupture'}
                  </span>
                </div>
                
                <div className="product-details">
                  <div className="detail-row">
                    <span className="detail-label">Fournisseur:</span>
                    <span className="detail-value">{getFournisseurName(produit.fournisseur)}</span>
                  </div>
                  
                  <div className="detail-row">
                    <span className="detail-label">Prix unitaire:</span>
                    <span className="detail-value price">{formatPrice(produit.prix)}</span>
                  </div>
                  
                  <div className="detail-row">
                    <span className="detail-label">Valeur totale:</span>
                    <span className="detail-value total">{formatPrice(produit.prix * produit.qte_p)}</span>
                  </div>
                </div>

                {produit.qte_p > 0 && (
                  <div className="product-actions">
                    <button 
                      onClick={() => createOrder(produit.id!)}
                      disabled={creatingOrder === produit.id}
                      className={`btn btn-order ${creatingOrder === produit.id ? 'loading' : ''}`}
                    >
                      {creatingOrder === produit.id ? 'Commande en cours...' : 'Commander (Qté: 1)'}
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
