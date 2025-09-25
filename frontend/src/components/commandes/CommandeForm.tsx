import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import commandeService from '../../services/commandeService';
import clientService from '../../services/clientService';
import produitService from '../../services/produitService';
import type { CommandeCreateData, CommandeUpdateData } from '../../services/commandeService';
import type { Client } from '../../services/clientService';
import type { Produit } from '../../services/produitService';
import './CommandeForm.css';

const CommandeForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string>('');
  const [clients, setClients] = useState<Client[]>([]);
  const [produits, setProduits] = useState<Produit[]>([]);

  const [formData, setFormData] = useState({
    num_com: '',
    client_id: 0,
    produit_id: 0,
    qte_c: 1
  });

  // Charger les données au montage
  useEffect(() => {
    loadInitialData();
  }, []);

  // Charger la commande si on est en mode édition
  useEffect(() => {
    if (isEditing && id) {
      loadCommande(parseInt(id));
    }
  }, [isEditing, id]);

  const loadInitialData = async () => {
    try {
      const [clientsData, produitsData] = await Promise.all([
        clientService.getAllClients(),
        produitService.getAllProduits()
      ]);
      setClients(clientsData);
      setProduits(produitsData);
    } catch (error) {
      setError('Erreur lors du chargement des données');
      console.error(error);
    } finally {
      setLoadingData(false);
    }
  };

  const loadCommande = async (commandeId: number) => {
    try {
      setLoading(true);
      const commande = await commandeService.getCommandeById(commandeId);
      
      // Extraire les IDs des URLs
      // Client URL format: /api/clients/{id}/client
      const clientParts = commande.client.split('/');
      const clientId = parseInt(clientParts[3] || '0'); // L'ID est à la position 3
      // Produit URL format: /api/produits/{id}
      const produitId = parseInt(commande.produit.split('/').pop() || '0');
      
      setFormData({
        num_com: commande.num_com,
        client_id: clientId,
        produit_id: produitId,
        qte_c: commande.qte_c
      });
    } catch (error) {
      setError('Erreur lors du chargement de la commande');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'client_id' || name === 'produit_id' || name === 'qte_c'
        ? parseInt(value) || 0 
        : value
    }));
    
    // Effacer l'erreur quand l'utilisateur modifie
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.client_id === 0) {
      setError('Veuillez sélectionner un client');
      return;
    }
    if (formData.produit_id === 0) {
      setError('Veuillez sélectionner un produit');
      return;
    }
    if (formData.qte_c <= 0) {
      setError('La quantité doit être supérieure à 0');
      return;
    }

    try {
      setLoading(true);
      
      if (isEditing) {
        const updateData: CommandeUpdateData = {
          num_com: formData.num_com,
          client_id: formData.client_id,
          produit_id: formData.produit_id,
          qte_c: formData.qte_c
        };
        await commandeService.updateCommande(parseInt(id!), updateData);
      } else {
        const createData: CommandeCreateData = {
          client_id: formData.client_id,
          produit_id: formData.produit_id,
          qte_c: formData.qte_c
        };
        await commandeService.createCommande(createData);
      }
      
      navigate('/commandes');
    } catch (error) {
      setError(isEditing ? 'Erreur lors de la modification de la commande' : 'Erreur lors de la création de la commande');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getSelectedProduit = () => {
    return produits.find(p => p.id === formData.produit_id);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const calculateTotal = () => {
    const produit = getSelectedProduit();
    if (produit && formData.qte_c > 0) {
      return produit.prix * formData.qte_c;
    }
    return 0;
  };

  if (loadingData) {
    return (
      <div className="commande-form-container">
        <div className="loading">Chargement des données...</div>
      </div>
    );
  }

  return (
    <div className="commande-form-container">
      <div className="commande-form-header">
        <div className="header-left">
          <Link to="/commandes" className="btn btn-back">
            ← Retour aux commandes
          </Link>
          <h1>{isEditing ? 'Modifier la Commande' : 'Nouvelle Commande'}</h1>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError('')} className="error-close">×</button>
        </div>
      )}

      <div className="form-card">
        <form onSubmit={handleSubmit} className="commande-form">
          {isEditing && (
            <div className="form-group">
              <label htmlFor="num_com">Numéro de Commande</label>
              <input
                type="text"
                id="num_com"
                name="num_com"
                value={formData.num_com}
                onChange={handleInputChange}
                placeholder="Numéro de commande"
                disabled={loading}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="client_id">Client *</label>
            <select
              id="client_id"
              name="client_id"
              value={formData.client_id}
              onChange={handleInputChange}
              required
              disabled={loading}
            >
              <option value={0}>Sélectionner un client</option>
              {clients.map(client => (
                <option key={client.num_c} value={client.num_c}>
                  {client.nom_c} {client.prenom_c}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="produit_id">Produit *</label>
            <select
              id="produit_id"
              name="produit_id"
              value={formData.produit_id}
              onChange={handleInputChange}
              required
              disabled={loading}
            >
              <option value={0}>Sélectionner un produit</option>
              {produits.map(produit => (
                <option key={produit.id} value={produit.id}>
                  {produit.nom_p} : {produit.qte_p} en stock
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="qte_c">Quantité *</label>
            <input
              type="number"
              id="qte_c"
              name="qte_c"
              value={formData.qte_c}
              onChange={handleInputChange}
              min="1"
              max={getSelectedProduit()?.qte_p || 999}
              required
              disabled={loading}
            />
            {getSelectedProduit() && (
              <small className="form-help">
                Stock disponible: {getSelectedProduit()!.qte_p}
              </small>
            )}
          </div>

          {getSelectedProduit() && formData.qte_c > 0 && (
            <div className="form-summary">
              <div className="summary-row">
                <span>Prix unitaire:</span>
                <span className="price">{formatPrice(getSelectedProduit()!.prix)}</span>
              </div>
              <div className="summary-row">
                <span>Quantité:</span>
                <span>{formData.qte_c}</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span className="price">{formatPrice(calculateTotal())}</span>
              </div>
            </div>
          )}

          <div className="form-actions">
            <Link to="/commandes" className="btn btn-secondary">
              Annuler
            </Link>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Traitement...' : (isEditing ? 'Modifier' : 'Créer')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommandeForm;