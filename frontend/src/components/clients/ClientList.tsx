import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import clientService from '../../services/clientService';
import type { Client } from '../../services/clientService';
import PasswordConfirmModal from '../common/PasswordConfirmModal';
import { printList } from '../../utils/printUtils';
import '../../styles/print-buttons.css';
import './ClientList.css';

const ClientList: React.FC = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [modalAction, setModalAction] = useState<'delete' | 'modify'>('delete');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // Charger les clients au montage du composant
  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      const data = await clientService.getAllClients();
      setClients(data);
      setError('');
    } catch (error) {
      setError('Erreur lors du chargement des clients');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await clientService.deleteClient(id);
      setClients(clients.filter(c => c.num_c !== id));
      setError('');
    } catch (error) {
      setError('Erreur lors de la suppression du client');
      console.error(error);
    }
  };

  const handleDeleteClick = (client: Client) => {
    setSelectedClient(client);
    setModalAction('delete');
    setShowPasswordModal(true);
  };

  const handleModifyClick = (client: Client) => {
    setSelectedClient(client);
    setModalAction('modify');
    setShowPasswordModal(true);
  };

  const handlePasswordConfirm = () => {
    if (selectedClient) {
      if (modalAction === 'delete') {
        handleDelete(selectedClient.num_c!);
      } else if (modalAction === 'modify') {
        navigate(`/clients/${selectedClient.num_c}/modifier`);
      }
    }
    setShowPasswordModal(false);
    setSelectedClient(null);
  };

  const handlePasswordCancel = () => {
    setShowPasswordModal(false);
    setSelectedClient(null);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Intl.DateTimeFormat('fr-FR').format(new Date(dateString));
  };

  const handlePrintList = () => {
    const columns = [
      { key: 'num_c', label: 'ID' },
      { key: 'nom_c', label: 'Nom' },
      { key: 'prenom_c', label: 'Prénom' },
      { key: 'tel_c', label: 'Téléphone' },
      { key: 'mail_c', label: 'Email' },
      { key: 'adresse_c', label: 'Adresse' },
      { key: 'datecreation_c', label: 'Date création', format: (date: string) => formatDate(date) }
    ];
    
    printList('Liste des Clients', clients, columns);
  };

  if (loading) {
    return (
      <div className="client-list-container">
        <div className="loading">Chargement des clients...</div>
      </div>
    );
  }

  return (
    <div className="client-list-container">
      <div className="client-list-header">
        <div className="header-left">
          <Link to="/dashboard" className="btn btn-back">
            🏠 Accueil
          </Link>
          <h1>Gestion des Clients</h1>
        </div>
        <div className="header-actions">
          <button onClick={handlePrintList} className="btn btn-print">
            🖨️ Imprimer la liste
          </button>
          <Link to="/clients/nouveau" className="btn btn-primary">
            <span className="icon">+</span>
            Nouveau Client
          </Link>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError('')} className="error-close">×</button>
        </div>
      )}

      <div className="client-stats">
        <div className="stat-card">
          <h3>Total Clients</h3>
          <p>{clients.length}</p>
        </div>
        <div className="stat-card">
          <h3>Clients Actifs</h3>
          <p>{clients.length}</p>
        </div>
      </div>

      <div className="client-table-container">
        <table className="client-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Téléphone</th>
              <th>Email</th>
              <th>Adresse</th>
              <th>Date création</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.length === 0 ? (
              <tr>
                <td colSpan={8} className="no-data">
                  Aucun client trouvé
                </td>
              </tr>
            ) : (
              clients.map((client) => (
                <tr key={client.num_c}>
                  <td>{client.num_c}</td>
                  <td className="client-name">{client.nom_c}</td>
                  <td className="client-prenom">{client.prenom_c}</td>
                  <td className="phone">{client.tel_c}</td>
                  <td className="email">{client.mail_c || 'N/A'}</td>
                  <td className="address">{client.adresse_c}</td>
                  <td className="date">{formatDate(client.datecreation_c)}</td>
                  <td className="actions">
                    <button
                      onClick={() => handleModifyClick(client)}
                      className="btn btn-sm btn-secondary"
                      title="Modifier"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteClick(client)}
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
        isOpen={showPasswordModal}
        onClose={handlePasswordCancel}
        onConfirm={handlePasswordConfirm}
        title={modalAction === 'delete' ? 'Confirmer la suppression' : 'Confirmer la modification'}
        message={
          selectedClient
            ? modalAction === 'delete'
              ? `Êtes-vous sûr de vouloir supprimer le client "${selectedClient.nom_c} ${selectedClient.prenom_c}" ?`
              : `Êtes-vous sûr de vouloir modifier le client "${selectedClient.nom_c} ${selectedClient.prenom_c}" ?`
            : ''
        }
        actionType={modalAction}
      />
    </div>
  );
};

export default ClientList;
