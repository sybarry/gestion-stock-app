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
    client_id: 0,
    produit_id: 0,
    qte_c: 1,
    prix: 0
  });
  
  const [selectedProduit, setSelectedProduit] = useState<Produit | null>(null);

  // Charger les données nécessaires au montage
  useEffect(() => {
    loadRequiredData();
  }, []);

  // Charger la commande si on est en mode édition
  useEffect(() => {
    if (isEditing && id && clients.length > 0 && produits.length > 0) {
      loadCommande(parseInt(id));
    }
  }, [isEditing, id, clients.length, produits.length]);

  const loadRequiredData = async () => {
    try {
      setLoadingData(true);
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
      
      // Extraire l'ID client de l'URL
      const clientId = parseInt(commande.client.split('/')[3] || '0');
      // Extraire l'ID produit de l'URL 
      const produitId = parseInt(commande.produit.split('/').pop() || '0');
      
      // Trouver le produit sélectionné pour récupérer le prix
      const produit = produits.find(p => p.id === produitId);
      
      setFormData({
        client_id: clientId,
        produit_id: produitId,
        qte_c: commande.qte_c,
        prix: produit?.prix || 0
      });
      
      setSelectedProduit(produit || null);
    } catch (error) {
      setError('Erreur lors du chargement de la commande');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'produit_id') {
      const produitId = parseInt(value) || 0;
      const produit = produits.find(p => p.id === produitId);
      setSelectedProduit(produit || null);
      setFormData(prev => ({
        ...prev,
        produit_id: produitId,
        prix: produit?.prix || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'client_id' || name === 'qte_c' || name === 'prix'
          ? parseInt(value) || 0 
          : value
      }));
    }
    
    // Effacer l'erreur quand l'utilisateur modifie
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.client_id || !formData.produit_id || !formData.qte_c || !formData.prix) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (formData.qte_c <= 0) {
      setError('La quantité doit être supérieure à 0');
      return;
    }
    
    if (formData.prix <= 0) {
      setError('Le prix doit être supérieur à 0');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Mettre à jour le prix du produit si il a changé
      if (selectedProduit && selectedProduit.id && selectedProduit.prix !== formData.prix) {
        await produitService.updateProduit(selectedProduit.id, {
          ...selectedProduit,
          prix: formData.prix
        });
      }

      if (isEditing && id) {
        const updateData: CommandeUpdateData = {
          client_id: formData.client_id,
          produit_id: formData.produit_id,
          qte_c: formData.qte_c
        };
        await commandeService.updateCommande(parseInt(id), updateData);
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
        <h1>{isEditing ? 'Modifier la commande' : 'Nouvelle commande'}</h1>
        <Link to="/commandes" className="btn btn-back">
          ← Retour à la liste
        </Link>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="commande-form">
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
            <option value={0}>Sélectionnez un client</option>
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
            <option value={0}>Sélectionnez un produit</option>
            {produits.map(produit => (
              <option key={produit.id} value={produit.id}>
                {produit.nom_p} - {produit.qte_p} en stock
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
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="prix">Prix unitaire *</label>
          <input
            type="number"
            id="prix"
            name="prix"
            value={formData.prix}
            onChange={handleInputChange}
            min="0"
            step="1"
            required
            disabled={loading || !selectedProduit}
            placeholder={selectedProduit ? `Prix actuel: ${selectedProduit.prix}` : "Sélectionnez un produit"}
          />
          {selectedProduit && formData.prix !== selectedProduit.prix && (
            <small className="price-warning">
              ⚠️ Le prix sera mis à jour de {selectedProduit.prix} à {formData.prix} pour ce produit
            </small>
          )}
        </div>
        
        {formData.qte_c > 0 && formData.prix > 0 && (
          <div className="form-group total-preview">
            <label>Total de la commande</label>
            <div className="total-amount">
              {formData.qte_c} × {formData.prix} = {(formData.qte_c * formData.prix)}
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
            {loading 
              ? (isEditing ? 'Modification...' : 'Création...') 
              : (isEditing ? 'Modifier' : 'Créer')
            }
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommandeForm;