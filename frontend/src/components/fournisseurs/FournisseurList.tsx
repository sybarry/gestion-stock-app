import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fournisseurService } from '../../services/fournisseurService';
import type { Fournisseur } from '../../services/fournisseurService';
import PasswordConfirmModal from '../common/PasswordConfirmModal';
import { printList } from '../../utils/printUtils';
import '../../styles/print-buttons.css';
import './FournisseurList.css';

const FournisseurList: React.FC = () => {
  const navigate = useNavigate();
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [modalAction, setModalAction] = useState<'delete' | 'modify'>('delete');
  const [selectedFournisseur, setSelectedFournisseur] = useState<Fournisseur | null>(null);

  // Charger les fournisseurs au montage du composant
  useEffect(() => {
    loadFournisseurs();
  }, []);

  const loadFournisseurs = async () => {
    try {
      setLoading(true);
      const data = await fournisseurService.getAll();
      setFournisseurs(data);
      setError('');
    } catch (error) {
      setError('Erreur lors du chargement des fournisseurs');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fournisseurService.delete(id);
      setFournisseurs(fournisseurs.filter(f => f.num_f !== id));
      setError('');
    } catch (error) {
      setError('Erreur lors de la suppression du fournisseur');
      console.error(error);
    }
  };

  const handleDeleteClick = (fournisseur: Fournisseur) => {
    setSelectedFournisseur(fournisseur);
    setModalAction('delete');
    setShowPasswordModal(true);
  };

  const handleModifyClick = (fournisseur: Fournisseur) => {
    setSelectedFournisseur(fournisseur);
    setModalAction('modify');
    setShowPasswordModal(true);
  };

  const handlePasswordConfirm = () => {
    if (selectedFournisseur) {
      if (modalAction === 'delete') {
        handleDelete(selectedFournisseur.num_f!);
      } else if (modalAction === 'modify') {
        navigate(`/fournisseurs/${selectedFournisseur.num_f}/modifier`);
      }
    }
    setShowPasswordModal(false);
    setSelectedFournisseur(null);
  };

  const handlePasswordCancel = () => {
    setShowPasswordModal(false);
    setSelectedFournisseur(null);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Intl.DateTimeFormat('fr-FR').format(new Date(dateString));
  };

  const handlePrintList = () => {
    const columns = [
      { key: 'num_f', label: 'ID' },
      { key: 'nom_f', label: 'Nom' },
      { key: 'tel_f', label: 'Téléphone' },
      { key: 'mail_f', label: 'Email' },
      { key: 'adr_f', label: 'Adresse' },
      { key: 'datecreation_f', label: 'Date création', format: (date: string) => formatDate(date) }
    ];
    
    printList('Liste des Fournisseurs', fournisseurs, columns);
  };

  if (loading) {
    return (
      <div className="fournisseur-list-container">
        <div className="loading">Chargement des fournisseurs...</div>
      </div>
    );
  }

  return (
    <div className="fournisseur-list-container">
      <div className="fournisseur-list-header">
        <div className="header-left">
          <Link to="/dashboard" className="btn btn-back">
            🏠 Accueil
          </Link>
          <h1>Gestion des Fournisseurs</h1>
        </div>
        <div className="header-actions">
          <button onClick={handlePrintList} className="btn btn-print">
            🖨️ Imprimer la liste
          </button>
          <Link to="/fournisseurs/nouveau" className="btn btn-primary">
            <span className="icon">+</span>
            Nouveau Fournisseur
          </Link>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError('')} className="error-close">×</button>
        </div>
      )}

      <div className="fournisseur-stats">
        <div className="stat-card">
          <h3>Total Fournisseurs</h3>
          <p>{fournisseurs.length}</p>
        </div>
        <div className="stat-card">
          <h3>Fournisseurs Actifs</h3>
          <p>{fournisseurs.length}</p>
        </div>
      </div>

      <div className="fournisseur-table-container">
        <table className="fournisseur-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Téléphone</th>
              <th>Email</th>
              <th>Adresse</th>
              <th>Date création</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {fournisseurs.length === 0 ? (
              <tr>
                <td colSpan={7} className="no-data">
                  Aucun fournisseur trouvé
                </td>
              </tr>
            ) : (
              fournisseurs.map((fournisseur) => (
                <tr key={fournisseur.num_f}>
                  <td>{fournisseur.num_f}</td>
                  <td className="fournisseur-name">{fournisseur.nom_f}</td>
                  <td className="phone">{fournisseur.tel_f}</td>
                  <td className="email">{fournisseur.mail_f || 'N/A'}</td>
                  <td className="address">{fournisseur.adr_f}</td>
                  <td className="date">{formatDate(fournisseur.datecreation_f)}</td>
                  <td className="actions">
                    <button
                      onClick={() => handleModifyClick(fournisseur)}
                      className="btn btn-sm btn-secondary"
                      title="Modifier"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteClick(fournisseur)}
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
          selectedFournisseur
            ? modalAction === 'delete'
              ? `Êtes-vous sûr de vouloir supprimer le fournisseur "${selectedFournisseur.nom_f}" ?`
              : `Êtes-vous sûr de vouloir modifier le fournisseur "${selectedFournisseur.nom_f}" ?`
            : ''
        }
        actionType={modalAction}
      />
    </div>
  );
};

export default FournisseurList;