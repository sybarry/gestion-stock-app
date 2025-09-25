import api from './api';

export interface Client {
  num_c: number;
  nom_c: string;
  prenom_c: string;
  tel_c: string;
  adresse_c: string;
  datecreation_c?: string;
  mail_c?: string;
  user?: {
    id: number;
  };
}

export interface ClientCreateData {
  nom_c: string;
  prenom_c: string;
  tel_c: string;
  adresse_c: string;
  mail_c?: string;
  user_id?: number; // ID de l'utilisateur à associer
}

export interface ClientUpdateData {
  nom_c?: string;
  prenom_c?: string;
  tel_c?: string;
  adresse_c?: string;
  mail_c?: string;
}

export const clientService = {
  // Récupérer tous les clients
  getAllClients: async (): Promise<Client[]> => {
    try {
      const response = await api.get('/clients');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des clients:', error);
      throw error;
    }
  },

  // Récupérer un client par ID
  getClientById: async (id: number): Promise<Client> => {
    try {
      const response = await api.get(`/clients/${id}/client`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du client ${id}:`, error);
      throw error;
    }
  },

  // Créer un nouveau client
  createClient: async (clientData: ClientCreateData): Promise<Client> => {
    try {
      const response = await api.post('/clients/create_client', clientData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création du client:', error);
      throw error;
    }
  },

  // Modifier un client existant
  updateClient: async (id: number, clientData: ClientUpdateData): Promise<Client> => {
    try {
      const response = await api.patch(`/clients/${id}/modifier`, clientData);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la modification du client ${id}:`, error);
      throw error;
    }
  },

  // Supprimer un client
  deleteClient: async (id: number): Promise<void> => {
    try {
      await api.delete(`/clients/${id}/supprimer`);
    } catch (error) {
      console.error(`Erreur lors de la suppression du client ${id}:`, error);
      throw error;
    }
  }
};

export default clientService;