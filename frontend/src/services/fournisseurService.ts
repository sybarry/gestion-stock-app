import api from './api';

export interface Fournisseur {
  num_f?: number;
  nom_f: string;
  tel_f: string;
  adr_f: string;
  datecreation_f?: string;
  mail_f?: string;
  user_id?: number;
  user?: {
    id: number;
    nom_user: string;
  };
}

export interface CreateFournisseurData {
  nom_f: string;
  tel_f: string;
  adr_f: string;
  datecreation_f?: string;
  mail_f?: string;
  user_id: number;
}

export interface UpdateFournisseurData {
  nom_f?: string;
  tel_f?: string;
  adr_f?: string;
  datecreation_f?: string;
  mail_f?: string;
}

export const fournisseurService = {
  // Récupérer tous les fournisseurs
  getAll: async (): Promise<Fournisseur[]> => {
    const response = await api.get('/fournisseurs');
    return response.data;
  },

  // Récupérer un fournisseur par ID
  getById: async (id: number): Promise<Fournisseur> => {
    const response = await api.get(`/fournisseurs/${id}/fournisseur`);
    return response.data;
  },

  // Créer un nouveau fournisseur
  create: async (fournisseur: CreateFournisseurData): Promise<Fournisseur> => {
    const response = await api.post('/fournisseurs/create_fournisseur', fournisseur);
    return response.data;
  },

  // Modifier un fournisseur
  update: async (id: number, fournisseur: UpdateFournisseurData): Promise<Fournisseur> => {
    const response = await api.patch(`/fournisseurs/${id}/modifier`, fournisseur);
    return response.data;
  },

  // Supprimer un fournisseur
  delete: async (id: number): Promise<void> => {
    await api.delete(`/fournisseurs/${id}/supprimer`);
  }
};