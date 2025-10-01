import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import adminService from '../../services/adminService';
import type { Admin } from '../../services/adminService';
import PasswordConfirmModal from '../common/PasswordConfirmModal';
import { printList } from '../../utils/printUtils';
import '../../styles/print-buttons.css';
import './AdminList.css';

const AdminList: React.FC = () => {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [modalAction, setModalAction] = useState<'delete' | 'modify'>('delete');
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);

  // Charger les admins au montage du composant
  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAll();
      setAdmins(data);
      setError('');
    } catch (error) {
      setError('Erreur lors du chargement des administrateurs');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await adminService.delete(id);
      setAdmins(admins.filter(a => a.id !== id));
      setError('');
    } catch (error) {
      setError('Erreur lors de la suppression de l\'administrateur');
      console.error(error);
    }
  };

  const handleDeleteClick = (admin: Admin) => {
    setSelectedAdmin(admin);
    setModalAction('delete');
    setShowPasswordModal(true);
  };

  const handleModifyClick = (admin: Admin) => {
    setSelectedAdmin(admin);
    setModalAction('modify');
    setShowPasswordModal(true);
  };

  const handlePasswordConfirm = async () => {
    if (selectedAdmin) {
      if (modalAction === 'delete') {
        await handleDelete(selectedAdmin.id!);
      } else if (modalAction === 'modify') {
        navigate(`/admins/${selectedAdmin.id}/modifier`);
      }
    }
    setShowPasswordModal(false);
    setSelectedAdmin(null);
  };

  const handlePasswordCancel = () => {
    setShowPasswordModal(false);
    setSelectedAdmin(null);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Intl.DateTimeFormat('fr-FR').format(new Date(dateString));
  };

  const handlePrintList = () => {
    const columns = [
      { key: 'id', label: 'ID' },
      { key: 'nom_a', label: 'Nom' },
      { key: 'prenom_a', label: 'Prénom' },
      { key: 'tel_a', label: 'Téléphone' },
      { key: 'mail_a', label: 'Email' },
      { key: 'adr_a', label: 'Adresse' },
      { key: 'datecreation_a', label: 'Date création', format: (date: string) => formatDate(date) }
    ];
    
    printList('Liste des Administrateurs', admins, columns);
  };

  if (loading) {
    return (
      <div className="admin-list-container">
        <div className="loading">Chargement des administrateurs...</div>
      </div>
    );
  }

  return (
    <div className="admin-list-container">
      <div className="admin-list-header">
        <div className="header-left">
          <Link to="/dashboard" className="btn btn-back">
            🏠 Accueil
          </Link>
          <h1>Gestion des Administrateurs</h1>
        </div>
        <div className="header-actions">
          <button onClick={handlePrintList} className="btn btn-print">
            🖨️ Imprimer la liste
          </button>
          <Link to="/admins/nouveau" className="btn btn-primary">
            <span className="icon">+</span>
            Nouvel Administrateur
          </Link>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError('')} className="error-close">×</button>
        </div>
      )}

      <div className="admin-stats">
        <div className="stat-card">
          <h3>Total Administrateurs</h3>
          <p>{admins.length}</p>
        </div>
        <div className="stat-card">
          <h3>Administrateurs Actifs</h3>
          <p>{admins.length}</p>
        </div>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
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
            {admins.length === 0 ? (
              <tr>
                <td colSpan={8} className="no-data">
                  Aucun administrateur trouvé
                </td>
              </tr>
            ) : (
              admins.map((admin) => (
                <tr key={admin.id}>
                  <td>{admin.id}</td>
                  <td>{admin.nom_a}</td>
                  <td>{admin.prenom_a}</td>
                  <td>{admin.tel_a}</td>
                  <td>{admin.mail_a}</td>
                  <td>{admin.adr_a}</td>
                  <td>{formatDate(admin.datecreation_a)}</td>
                  <td className="actions">
                    <button
                      onClick={() => handleModifyClick(admin)}
                      className="btn btn-sm btn-secondary"
                      title="Modifier"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteClick(admin)}
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
          selectedAdmin
            ? modalAction === 'delete'
              ? `Êtes-vous sûr de vouloir supprimer l'administrateur "${selectedAdmin.nom_a} ${selectedAdmin.prenom_a}" ?`
              : `Êtes-vous sûr de vouloir modifier l'administrateur "${selectedAdmin.nom_a} ${selectedAdmin.prenom_a}" ?`
            : ''
        }
        actionType={modalAction}
      />
    </div>
  );
};

export default AdminList;