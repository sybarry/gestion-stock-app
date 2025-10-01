import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import commandeService from '../../services/commandeService';
import clientService from '../../services/clientService';
import produitService from '../../services/produitService';
import type { Commande } from '../../services/commandeService';
import type { Client } from '../../services/clientService';
import type { Produit } from '../../services/produitService';
import PasswordConfirmModal from '../common/PasswordConfirmModal';
import { printList } from '../../utils/printUtils';
import '../../styles/print-buttons.css';
import './CommandeList.css';

const CommandeList: React.FC = () => {
  const navigate = useNavigate();
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [produits, setProduits] = useState<Produit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [modalData, setModalData] = useState<{
    isOpen: boolean;
    action: 'delete' | 'modify';
    commandeId: number | null;
    commandeNum: string;
  }>({
    isOpen: false,
    action: 'delete',
    commandeId: null,
    commandeNum: ''
  });

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

  const handleDeleteClick = (commande: Commande) => {
    setModalData({
      isOpen: true,
      action: 'delete',
      commandeId: commande.id ?? null,
      commandeNum: commande.num_com
    });
  };

  const handleModifyClick = (commande: Commande) => {
    setModalData({
      isOpen: true,
      action: 'modify',
      commandeId: commande.id ?? null,
      commandeNum: commande.num_com
    });
  };

  const handleModalConfirm = async () => {
    if (modalData.commandeId === null) return;

    try {
      if (modalData.action === 'delete') {
        await commandeService.deleteCommande(modalData.commandeId);
        setCommandes(commandes.filter(c => c.id !== modalData.commandeId));
        setError('');
      } else if (modalData.action === 'modify') {
        // Rediriger vers la page de modification
        navigate(`/commandes/${modalData.commandeId}/modifier`);
      }
      setModalData({ isOpen: false, action: 'delete', commandeId: null, commandeNum: '' });
    } catch (error) {
      setError(`Erreur lors de l'opération sur la commande`);
      console.error(error);
    }
  };

  const handleModalClose = () => {
    setModalData({ isOpen: false, action: 'delete', commandeId: null, commandeNum: '' });
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

  const getProduitPrice = (produitUrl: string) => {
    const produitId = parseInt(produitUrl.split('/').pop() || '0');
    const produit = produits.find(p => p.id === produitId);
    return produit ? produit.prix : 0;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price); // Affichage direct sans conversion
  };

    const formatDate = (dateString: string) => {
    if (!dateString) return 'Date non définie';
    
    try {
      return new Intl.DateTimeFormat('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(new Date(dateString));
    } catch (error) {
      return 'Date invalide';
    }
  };

  const handlePrintList = () => {
    const commandesForPrint = commandes.map(commande => {
      const clientInfo = getClientInfo(commande.client);
      const produitInfo = getProduitInfo(commande.produit);
      const prixUnitaire = getProduitPrice(commande.produit);
      const total = prixUnitaire * commande.qte_c;
      
      return {
        ...commande,
        clientNom: clientInfo,
        produitNom: produitInfo,
        prixUnitaire,
        total
      };
    });
    
    const columns = [
      { key: 'id', label: 'ID' },
      { key: 'clientNom', label: 'Client' },
      { key: 'produitNom', label: 'Produit' },
      { key: 'qte_c', label: 'Quantité' },
      { key: 'prixUnitaire', label: 'Prix unitaire', format: (price: number) => formatPrice(price) },
      { key: 'total', label: 'Total', format: (total: number) => formatPrice(total) },
      { key: 'date_commande', label: 'Date de création', format: (date: string) => formatDate(date) }
    ];
    
    printList('Liste des Commandes', commandesForPrint, columns);
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
        <div className="header-actions">
          <button onClick={handlePrintList} className="btn btn-print">
            🖨️ Imprimer la liste
          </button>
          <Link to="/commandes/nouvelle" className="btn btn-primary">
            <span className="icon">+</span>
            Nouvelle Commande
          </Link>
        </div>
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
                      <button
                        onClick={() => handleModifyClick(commande)}
                        className="btn btn-sm btn-secondary"
                        title="Modifier"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteClick(commande)}
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

      {/* Modal de confirmation avec mot de passe */}
      <PasswordConfirmModal
        isOpen={modalData.isOpen}
        onConfirm={handleModalConfirm}
        onClose={handleModalClose}
        title={modalData.action === 'delete' ? 'Supprimer la commande' : 'Modifier la commande'}
        message={`Voulez-vous vraiment ${modalData.action === 'delete' ? 'supprimer' : 'modifier'} la commande "${modalData.commandeNum}" ?`}
        actionType={modalData.action}
      />
    </div>
  );
};

export default CommandeList;