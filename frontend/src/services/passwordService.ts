const API_BASE_URL = 'http://localhost:8000/api';

export interface VerifyPasswordRequest {
  password: string;
}

export interface VerifyPasswordResponse {
  valid: boolean;
  message?: string;
}

export const verifyUserPassword = async (password: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/verify-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Ajouter le token d'authentification si nécessaire
        // 'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Mot de passe incorrect');
      }
      throw new Error('Erreur de vérification du mot de passe');
    }

    const data: VerifyPasswordResponse = await response.json();
    return data.valid;

  } catch (error) {
    console.error('Erreur lors de la vérification du mot de passe:', error);
    throw error;
  }
};

// Version temporaire pour le développement (à remplacer par l'API réelle)
export const verifyPasswordTemp = async (password: string): Promise<boolean> => {
  // Simuler un appel API
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Pour le développement, accepter "admin" comme mot de passe
      if (password === 'admin' || password === 'saikou1993') {
        resolve(true);
      } else {
        reject(new Error('Mot de passe incorrect'));
      }
    }, 500);
  });
};