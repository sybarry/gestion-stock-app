import api from './api';

export interface Fournisseur {
  num_f: number;
  nom_f: string;
}

export interface Produit {
  id?: number;
  nom_p: string;
  fournisseur: Fournisseur;
  qte_p: number;
  prix: number;
  total?: number;
}

export interface CreateProduitData {
  nom_p: string;
  fournisseur_id: number; // num_f du fournisseur
  qte_p: number;
  prix: number;
}

export interface UpdateProduitData {
  nom_p?: string;
  fournisseur_id?: number;
  qte_p?: number;
  prix?: number;
}

class ProduitService {
  // Récupérer tous les produits
  async getAllProduits(): Promise<Produit[]> {
    try {
      const response = await api.get('/produits');
      return Array.isArray(response.data) ? response.data : response.data['hydra:member'] || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error);
      throw new Error('Erreur lors de la récupération des produits');
    }
  }

  // Récupérer un produit par ID
  async getProduitById(id: number): Promise<Produit> {
    try {
      const response = await api.get(`/produits/${id}/produit`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du produit:', error);
      throw new Error('Erreur lors de la récupération du produit');
    }
  }

  // Créer un nouveau produit
  async createProduit(data: CreateProduitData): Promise<Produit> {
    try {
      const response = await api.post('/produits/create_produit', data);
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors de la création du produit:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors de la création du produit');
    }
  }

  // Modifier un produit
  async updateProduit(id: number, data: UpdateProduitData): Promise<Produit> {
    try {
      const response = await api.patch(`/produits/${id}/modifier`, data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la modification du produit:', error);
      throw new Error('Erreur lors de la modification du produit');
    }
  }

  // Supprimer un produit
  async deleteProduit(id: number): Promise<void> {
    try {
      await api.delete(`/produits/${id}/supprimer`);
    } catch (error) {
      console.error('Erreur lors de la suppression du produit:', error);
      throw new Error('Erreur lors de la suppression du produit');
    }
  }
}

export default new ProduitService();