//import axios from 'axios';
import { useApi } from '../hooks/useApi';


export interface LoginResponse {
    access_token: string;
    refresh_token: string;
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
    try {
        const api = useApi(); // instance Axios configurée.

        // Envoie une requête POST à l'API d'authentification pour se connecter.
        const response = await api.post<LoginResponse>(`${import.meta.env.VITE_API_BASE_URL}auth/signin`, {
            email, // Envoie l'email fourni comme partie du corps de la requête.
            password, // Envoie le mot de passe fourni comme partie du corps de la requête.
        });

        // Extrait les tokens d'accès et de renouvellement de la réponse.
        const { access_token, refresh_token } = response.data;
        console.log("🚀 ~ login ~ response.data:", response.data)

        // Stocke les tokens dans le localStorage pour les utiliser dans les requêtes futures.
        localStorage.setItem("accessToken", access_token);
        localStorage.setItem("refreshToken", refresh_token);

        // Renvoie les tokens pour une utilisation immédiate si nécessaire.
        return response.data;
    } catch (error: any) {
        console.log("🚀 ~ login ~ error:", error)
        // En cas d'erreur lors de la requête.
        // lance une erreur avec les données de réponse de l'erreur.
        throw error.response.data;
    }
};