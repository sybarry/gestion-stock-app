import api from './api';

export interface Commande {
  id: number;
  num_com: string;
  client: string;
  produit: string;
  qte_c: number;
  date_commande: string;
}

export interface CommandeCreateData {
  client_id: number;
  produit_id: number;
  qte_c: number;
}

export interface CommandeUpdateData {
  num_com?: string;
  client_id?: number;
  produit_id?: number;
  qte_c?: number;
}

export const commandeService = {
  // Récupérer toutes les commandes
  getAllCommandes: async (): Promise<Commande[]> => {
    try {
      const response = await api.get('/commandes');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes:', error);
      throw error;
    }
  },

  // Récupérer une commande par ID
  getCommandeById: async (id: number): Promise<Commande> => {
    try {
      const response = await api.get(`/commandes/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la commande ${id}:`, error);
      throw error;
    }
  },

  // Créer une nouvelle commande
  createCommande: async (commandeData: CommandeCreateData): Promise<Commande> => {
    try {
      const response = await api.post('/commandes/create_commande', commandeData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la commande:', error);
      throw error;
    }
  },

  // Modifier une commande existante
  updateCommande: async (id: number, commandeData: CommandeUpdateData): Promise<Commande> => {
    try {
      const response = await api.patch(`/commandes/${id}/modifier`, commandeData);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la modification de la commande ${id}:`, error);
      throw error;
    }
  },

  // Supprimer une commande
  deleteCommande: async (id: number): Promise<void> => {
    try {
      await api.delete(`/commandes/${id}/supprimer`);
    } catch (error) {
      console.error(`Erreur lors de la suppression de la commande ${id}:`, error);
      throw error;
    }
  }
};

export default commandeService;