import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import commandeService from '../../services/commandeService';
import clientService from '../../services/clientService';
import produitService from '../../services/produitService';
import type { Commande } from '../../services/commandeService';
import type { Client } from '../../services/clientService';
import type { Produit } from '../../services/produitService';
import './CommandeList.css';

const CommandeList: React.FC = () => {
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [produits, setProduits] = useState<Produit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  // Charger les données au montage du composant
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [commandesData, clientsData, produitsData] = await Promise.all([
        commandeService.getAllCommandes(),
        clientService.getAllClients(),
        produitService.getAllProduits()
      ]);
      setCommandes(commandesData);
      setClients(clientsData);
      setProduits(produitsData);
      setError('');
    } catch (error) {
      setError('Erreur lors du chargement des données');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await commandeService.deleteCommande(id);
      setCommandes(commandes.filter(c => c.id !== id));
      setDeleteConfirm(null);
      setError('');
    } catch (error) {
      setError('Erreur lors de la suppression de la commande');
      console.error(error);
    }
  };

  const getClientInfo = (clientUrl: string) => {
    // URL format: /api/clients/{id}/client
    const parts = clientUrl.split('/');
    const clientId = parseInt(parts[3] || '0'); // L'ID est à la position 3: ['', 'api', 'clients', 'ID', 'client']
    const client = clients.find(c => c.num_c === clientId);
    return client ? `${client.nom_c} ${client.prenom_c}` : `Client #${clientId}`;
  };

  const getProduitInfo = (produitUrl: string) => {
    const produitId = parseInt(produitUrl.split('/').pop() || '0');
    const produit = produits.find(p => p.id === produitId);
    return produit ? produit.nom_p : `Produit #${produitId}`;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price / 100); // Les prix sont en centimes
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Date non définie';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Date invalide';
    }
    
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const calculateTotal = (commande: Commande) => {
    const produitId = parseInt(commande.produit.split('/').pop() || '0');
    const produit = produits.find(p => p.id === produitId);
    if (produit) {
      return produit.prix * commande.qte_c;
    }
    return 0;
  };

  if (loading) {
    return (
      <div className="commande-list-container">
        <div className="loading">Chargement des commandes...</div>
      </div>
    );
  }

  return (
    <div className="commande-list-container">
      <div className="commande-list-header">
        <div className="header-left">
          <Link to="/dashboard" className="btn btn-back">
            🏠 Accueil
          </Link>
          <h1>Gestion des Commandes</h1>
        </div>
        <Link to="/commandes/nouveau" className="btn btn-primary">
          <span className="icon">+</span>
          Nouvelle Commande
        </Link>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError('')} className="error-close">×</button>
        </div>
      )}

      <div className="commande-stats">
        <div className="stat-card">
          <h3>Total Commandes</h3>
          <p>{commandes.length}</p>
        </div>
        <div className="stat-card">
          <h3>Valeur Commandes</h3>
          <p>{formatPrice(commandes.reduce((sum, c) => sum + calculateTotal(c), 0))}</p>
        </div>
        <div className="stat-card">
          <h3>Quantité Totale</h3>
          <p>{commandes.reduce((sum, c) => sum + c.qte_c, 0)}</p>
        </div>
      </div>

      <div className="commande-table-container">
        <table className="commande-table">
          <thead>
            <tr>
              <th>N° Commande</th>
              <th>Client</th>
              <th>Produit</th>
              <th>Quantité</th>
              <th>Prix Unit.</th>
              <th>Total</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {commandes.length === 0 ? (
              <tr>
                <td colSpan={8} className="no-data">
                  Aucune commande trouvée
                </td>
              </tr>
            ) : (
              commandes.map((commande) => {
                const produitId = parseInt(commande.produit.split('/').pop() || '0');
                const produit = produits.find(p => p.id === produitId);
                const prixUnitaire = produit ? produit.prix : 0;
                const total = calculateTotal(commande);

                return (
                  <tr key={commande.id}>
                    <td className="commande-num">{commande.num_com}</td>
                    <td className="client-name">{getClientInfo(commande.client)}</td>
                    <td className="produit-name">{getProduitInfo(commande.produit)}</td>
                    <td className="quantity">{commande.qte_c}</td>
                    <td className="price">{formatPrice(prixUnitaire)}</td>
                    <td className="total">{formatPrice(total)}</td>
                    <td className="date">{formatDate(commande.date_commande)}</td>
                    <td className="actions">
                      <Link 
                        to={`/commandes/${commande.id}/modifier`}
                        className="btn btn-sm btn-secondary"
                        title="Modifier"
                      >
                        ✏️
                      </Link>
                      <button
                        onClick={() => setDeleteConfirm(commande.id!)}
                        className="btn btn-sm btn-danger"
                        title="Supprimer"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                );
              })
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
              Êtes-vous sûr de vouloir supprimer la commande "{commandes.find(c => c.id === deleteConfirm)?.num_com}" ?
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

export default CommandeList;