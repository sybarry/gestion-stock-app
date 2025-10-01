export interface Admin {
  id?: number;
  nom_a: string;
  prenom_a: string;
  tel_a: string;
  adr_a: string;
  mail_a: string;
  datecreation_a: string;
  user?: {
    id: number;
    nom_user: string;
    role: string;
  };
}

class AdminService {
  private baseUrl = 'http://localhost:8000/api';

  async getAll(): Promise<Admin[]> {
    try {
      const response = await fetch(`${this.baseUrl}/admins`);
      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des admins:', error);
      throw error;
    }
  }

  async getById(id: number): Promise<Admin> {
    try {
      const response = await fetch(`${this.baseUrl}/admins/${id}/admin`);
      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'admin:', error);
      throw error;
    }
  }

  async create(adminData: Omit<Admin, 'id'>): Promise<Admin> {
    try {
      const response = await fetch(`${this.baseUrl}/admins/ajouter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(adminData),
      });
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la création de l\'admin:', error);
      throw error;
    }
  }

  async update(id: number, adminData: Partial<Admin>): Promise<Admin> {
    try {
      const response = await fetch(`${this.baseUrl}/admins/${id}/modifier`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(adminData),
      });
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la modification de l\'admin:', error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/admins/${id}/supprimer`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'admin:', error);
      throw error;
    }
  }
}

export const adminService = new AdminService();
export default adminService;