import api from './api';

export interface User {
  id: number;
  nom_user: string;
  password: string;
  role: string;
}

export interface UserCreateData {
  nom_user: string;
  password: string;
  role: string;
}

export const userService = {
  // Créer un nouvel utilisateur
  createUser: async (userData: UserCreateData): Promise<User> => {
    try {
      const response = await api.post('/users/create_user', userData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      throw error;
    }
  }
};

export default userService;