import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fournisseurService } from '../../services/fournisseurService';
import type { Fournisseur } from '../../services/fournisseurService';
import './FournisseurList.css';

const FournisseurList: React.FC = () => {
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

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
      setDeleteConfirm(null);
      setError('');
    } catch (error) {
      setError('Erreur lors de la suppression du fournisseur');
      console.error(error);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Intl.DateTimeFormat('fr-FR').format(new Date(dateString));
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
        <Link to="/fournisseurs/nouveau" className="btn btn-primary">
          <span className="icon">+</span>
          Nouveau Fournisseur
        </Link>
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
                    <Link 
                      to={`/fournisseurs/${fournisseur.num_f}/modifier`}
                      className="btn btn-sm btn-secondary"
                      title="Modifier"
                    >
                      ✏️
                    </Link>
                    <button
                      onClick={() => setDeleteConfirm(fournisseur.num_f!)}
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
              Êtes-vous sûr de vouloir supprimer le fournisseur "{fournisseurs.find(f => f.num_f === deleteConfirm)?.nom_f}" ?
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

export default FournisseurList;