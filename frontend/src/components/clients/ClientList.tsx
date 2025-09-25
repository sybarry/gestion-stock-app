import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import clientService from '../../services/clientService';
import type { Client } from '../../services/clientService';
import './ClientList.css';

const ClientList: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

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
      setDeleteConfirm(null);
      setError('');
    } catch (error) {
      setError('Erreur lors de la suppression du client');
      console.error(error);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Intl.DateTimeFormat('fr-FR').format(new Date(dateString));
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
        <Link to="/clients/nouveau" className="btn btn-primary">
          <span className="icon">+</span>
          Nouveau Client
        </Link>
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
                    <Link 
                      to={`/clients/${client.num_c}/modifier`}
                      className="btn btn-sm btn-secondary"
                      title="Modifier"
                    >
                      ✏️
                    </Link>
                    <button
                      onClick={() => setDeleteConfirm(client.num_c!)}
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
              Êtes-vous sûr de vouloir supprimer le client "{clients.find(c => c.num_c === deleteConfirm)?.nom_c} {clients.find(c => c.num_c === deleteConfirm)?.prenom_c}" ?
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

export default ClientList;
