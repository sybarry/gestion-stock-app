import api from './api';

export interface User {
  id: number;
  nom_user: string;
  role: 'client' | 'fournisseur' | 'admin' | 'user';
}

export interface LoginCredentials {
  nom_user: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  role: 'client' | 'fournisseur' | 'admin' | 'user';
  // Champs optionnels pour la création d'entités associées
  nom_c?: string;
  prenom_c?: string;
  tel_c?: string;
  adr_c?: string;
  mail_c?: string;
  datecreation_c?: string;
  // Champs fournisseur
  nom_f?: string;
  tel_f?: string;
  adr_f?: string;
  mail_f?: string;
  datecreation_f?: string;
  // Champs admin
  nom_a?: string;
  prenom_a?: string;
  tel_a?: string;
  adr_a?: string;
  mail_a?: string;
  datecreation_a?: string;
}

export interface AuthResponse {
  user: User;
  token?: string;
}

class AuthService {
  private currentUser: User | null = null;

  // Méthode de connexion
  async login(nom_user: string, password: string): Promise<boolean> {
    try {
      // Récupérer tous les utilisateurs depuis l'endpoint existant
      const response = await api.get('/users');
      
      // L'API retourne directement un array, pas un objet avec hydra:member
      const users = Array.isArray(response.data) ? response.data : response.data['hydra:member'];
      
      // Chercher l'utilisateur avec le nom_user ET le password correspondants
      const user = users.find((u: any) => 
        u.nom_user === nom_user && u.password === password
      );
      
      if (user) {
        // Stocker les informations de l'utilisateur
        const userData = {
          id: user.id,
          nom_user: user.nom_user,
          role: user.role
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', `token_${user.id}_${Date.now()}`);
        
        this.currentUser = userData;
        return true;
      } else {
        return false;
      }
    } catch (error: any) {
      console.error('Erreur lors de la connexion:', error);
      return false;
    }
  }

  // Inscription avec création combinée
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post('/users/create_user', data);
      const user = response.data;
      
      // Générer un token pour le nouvel utilisateur
      const token = `mock_token_${user.id}_${Date.now()}`;
      
      // Stocker le token et les données utilisateur
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({
        id: user.id,
        nom_user: user.nom_user,
        role: user.role
      }));
      
      this.currentUser = {
        id: user.id,
        nom_user: user.nom_user,
        role: user.role
      };
      
      return {
        user: this.currentUser,
        token
      };
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      throw new Error('Erreur lors de l\'inscription');
    }
  }

  // Déconnexion
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser = null;
  }

  // Vérifier si l'utilisateur est connecté
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    return !!(token && userData);
  }

  // Récupérer les données de l'utilisateur connecté
  getCurrentUser(): User | null {
    if (this.currentUser) {
      return this.currentUser;
    }
    
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        this.currentUser = JSON.parse(userData);
        return this.currentUser;
      } catch (error) {
        console.error('Erreur parsing user data:', error);
        this.logout();
        return null;
      }
    }
    return null;
  }

  // Récupérer le token
  getToken(): string | null {
    return localStorage.getItem('token');
  }
}

export default new AuthService();