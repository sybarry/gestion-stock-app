import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import clientService from '../../services/clientService';
import commandeService from '../../services/commandeService';
import produitService from '../../services/produitService';
import type { Client } from '../../services/clientService';
import type { Commande } from '../../services/commandeService';
import type { Produit } from '../../services/produitService';
import './FactureClient.css';

const FactureClient: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [produits, setProduits] = useState<Produit[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [loadingClients, setLoadingClients] = useState(true);
  const [error, setError] = useState<string>('');

  // Charger les clients au montage
  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoadingClients(true);
      const data = await clientService.getAllClients();
      setClients(data);
    } catch (error) {
      setError('Erreur lors du chargement des clients');
      console.error(error);
    } finally {
      setLoadingClients(false);
    }
  };

  const loadCommandesClient = async () => {
    if (selectedClientId === 0 || !selectedDate) {
      setCommandes([]);
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // Récupérer toutes les commandes et tous les produits en parallèle
      const [toutesCommandes, tousLesProduits] = await Promise.all([
        commandeService.getAllCommandes(),
        produitService.getAllProduits()
      ]);
      
      // Filtrer par client et date
      const commandesFiltrees = toutesCommandes.filter(commande => {
        // Extraire l'ID du client depuis l'URL format: /api/clients/{id}/client
        const parts = commande.client.split('/');
        const clientId = parseInt(parts[3] || '0'); // L'ID est à la position 3
        
        // Vérifier la date (comparer seulement la date, pas l'heure)
        const dateCommande = new Date(commande.date_commande);
        const dateSelectionnee = new Date(selectedDate);
        
        const memeDate = dateCommande.toISOString().split('T')[0] === dateSelectionnee.toISOString().split('T')[0];
        
        return clientId === selectedClientId && memeDate;
      });
      
      setCommandes(commandesFiltrees);
      setProduits(tousLesProduits);
    } catch (error) {
      setError('Erreur lors du chargement des commandes');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Charger les commandes quand client ou date change
  useEffect(() => {
    loadCommandesClient();
  }, [selectedClientId, selectedDate]);

  const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedClientId(parseInt(e.target.value) || 0);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const getSelectedClient = () => {
    return clients.find(client => client.num_c === selectedClientId);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getProduitById = (produitId: number) => {
    return produits.find(produit => produit.id === produitId);
  };

    const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price); // Affichage direct sans conversion
  };

  const calculateCommandeTotal = (commande: Commande) => {
    const produitId = parseInt(commande.produit.split('/').pop() || '0');
    const produit = getProduitById(produitId);
    if (produit) {
      return produit.prix * commande.qte_c;
    }
    return 0;
  };

  const calculateGrandTotal = () => {
    return commandes.reduce((total, commande) => {
      return total + calculateCommandeTotal(commande);
    }, 0);
  };



  if (loadingClients) {
    return (
      <div className="facture-container">
        <div className="loading">Chargement des clients...</div>
      </div>
    );
  }

  return (
    <div className="facture-container">
      <div className="facture-header">
        <Link to="/dashboard" className="btn btn-back">
          🏠 Accueil
        </Link>
        <h1>Factures Client</h1>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError('')} className="error-close">×</button>
        </div>
      )}

      <div className="facture-filters">
        <div className="filter-group">
          <label htmlFor="client">Client *</label>
          <select
            id="client"
            value={selectedClientId}
            onChange={handleClientChange}
            className="form-select"
          >
            <option value={0}>Sélectionner un client...</option>
            {clients.map(client => (
              <option key={client.num_c} value={client.num_c}>
                {client.nom_c} {client.prenom_c}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="date">Date *</label>
          <input
            type="date"
            id="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="form-input"
          />
        </div>
      </div>

      {selectedClientId > 0 && selectedDate && (
        <div className="facture-info">
          <div className="client-info">
            <h3>Client : {getSelectedClient()?.nom_c} {getSelectedClient()?.prenom_c}</h3>
            <p>Date : {formatDate(selectedDate)}</p>
          </div>
          {commandes.length > 0 && (
            <button onClick={() => window.print()} className="btn btn-print">
              🖨️ Imprimer la facture
            </button>
          )}
        </div>
      )}

      {loading && (
        <div className="loading">Chargement des commandes...</div>
      )}

      {selectedClientId > 0 && selectedDate && !loading && (
        <div className="commandes-section">
          <h3>Commandes ({commandes.length})</h3>
          
          {commandes.length === 0 ? (
            <div className="no-commandes">
              Aucune commande trouvée pour ce client à cette date.
            </div>
          ) : (
            <div className="commandes-table-container">
              <table className="commandes-table">
                <thead>
                  <tr>
                    <th>N° Commande</th>
                    <th>Produit</th>
                    <th>Quantité</th>
                    <th>Prix Unitaire</th>
                    <th>Total</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {commandes.map(commande => {
                    const produitId = parseInt(commande.produit.split('/').pop() || '0');
                    const produit = getProduitById(produitId);
                    const total = calculateCommandeTotal(commande);
                    
                    return (
                      <tr key={commande.id}>
                        <td>{commande.num_com}</td>
                        <td>{produit?.nom_p || `Produit ${produitId}`}</td>
                        <td>{commande.qte_c}</td>
                        <td className="price">{produit ? formatPrice(produit.prix) : '-'}</td>
                        <td className="total">{formatPrice(total)}</td>
                        <td>{formatDate(commande.date_commande)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="facture-summary">
                <div className="summary-row">
                  <span>Nombre de commandes : {commandes.length}</span>
                </div>
                <div className="summary-row total">
                  <span><strong>Total général : {formatPrice(calculateGrandTotal())}</strong></span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FactureClient;