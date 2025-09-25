import axios from 'axios';

const API_URL = 'http://localhost:8000';

export interface Facture {
  id?: number;
  numero: string;
  date: string;
  client: Client | string; // Peut être un objet Client complet ou une URI
  total: string;
  statut: string;
}

export interface Client {
  num_c: number;
  nom_c: string;
  prenom_c: string;
  adresse_c: string;
  tel_c: string;
}

export interface Commande {
  id: number;
  num_com: string;
  qte_c: number;
  date_commande: string;
  client: Client | string;
  produit: Produit | string;
}

export interface Produit {
  id: number;
  nom_p: string;
  prix: number;
  description_p?: string;
}

// Service pour les produits
export const produitService = {
  async getById(id: number): Promise<Produit> {
    // Utiliser la collection car l'API individuelle ne retourne pas tous les champs
    const response = await axios.get(`${API_URL}/api/produits`);
    const produits = response.data['hydra:member'] || response.data;
    const produit = produits.find((p: any) => p.id === id);
    
    if (!produit) {
      throw new Error(`Produit ${id} non trouvé`);
    }
    
    return produit;
  }
};

export const factureService = {
  async getAll(): Promise<Facture[]> {
    const response = await axios.get(`${API_URL}/api/factures`);
    return response.data['hydra:member'] || response.data;
  },

  async getById(id: number): Promise<Facture> {
    const response = await axios.get(`${API_URL}/api/factures/${id}`);
    return response.data;
  },

  // Méthode pour obtenir une facture avec les détails du client
  async getFactureWithClient(id: number): Promise<Facture & { clientData?: Client }> {
    const facture = await this.getById(id);
    
    // Si le client est une URI, récupérer les détails
    if (typeof facture.client === 'string') {
      // URL format: /api/clients/{id}/client
      const parts = facture.client.split('/');
      const clientId = parseInt(parts[3] || '0'); // L'ID est à la position 3
      if (clientId > 0) {
        try {
          const clientResponse = await axios.get(`${API_URL}/api/clients/${clientId}`);
          return {
            ...facture,
            clientData: clientResponse.data
          };
        } catch (error) {
          console.error('Erreur lors du chargement du client:', error);
        }
      }
    }
    
    return facture;
  },

  async create(data: {
    client: string;
    total: string;
    statut?: string;
  }): Promise<Facture> {
    const response = await axios.post(`${API_URL}/api/factures`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await axios.delete(`${API_URL}/api/factures/${id}`);
  },

  async getCommandesClient(clientId: number): Promise<any[]> {
    const response = await axios.get(`${API_URL}/api/commandes`);
    const allCommandes = response.data['hydra:member'] || response.data;
    
    // Filtrer par client - l'API retourne les clients comme des URIs
    let commandesClient = allCommandes.filter((cmd: any) => {
      // cmd.client est une URI comme "/api/clients/{id}/client"
      if (typeof cmd.client === 'string') {
        const parts = cmd.client.split('/');
        const clientIdFromUri = parseInt(parts[3] || '0'); // L'ID est à la position 3
        return clientIdFromUri === clientId;
      }
      // Si c'est un objet client
      return cmd.client && (cmd.client.num_c === clientId || cmd.client.id === clientId);
    });

    // Enrichir chaque commande avec les détails du produit
    const commandesEnrichies = await Promise.all(
      commandesClient.map(async (cmd: any) => {
        if (typeof cmd.produit === 'string') {
          // Extraire l'ID du produit depuis l'URI "/api/produits/15"
          const produitId = parseInt(cmd.produit.split('/').pop() || '0');
          try {
            const produitDetails = await produitService.getById(produitId);
            return {
              ...cmd,
              produit: produitDetails,
              total: (produitDetails.prix * cmd.qte_c).toFixed(2)
            };
          } catch (error) {
            console.error(`Erreur lors de la récupération du produit ${produitId}:`, error);
            return {
              ...cmd,
              produit: { id: produitId, nom_p: 'Produit non trouvé', prix: 0 },
              total: '0.00'
            };
          }
        }
        return cmd;
      })
    );

    return commandesEnrichies;
  }
};

export const clientService = {
  async getAll(): Promise<Client[]> {
    const response = await axios.get(`${API_URL}/api/clients`);
    return response.data['hydra:member'] || response.data;
  }
};
