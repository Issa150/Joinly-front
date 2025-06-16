// src/hooks/useApi.ts
import axios, { AxiosInstance } from "axios";



export function useApi() {
    const headers = {
        'Content-Type': 'application/json',
        "Access-control-Allow-Origin": "*"
    }

    const api: AxiosInstance = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
        headers
    })

    api.interceptors.request.use((config: any) => {

        const token = localStorage.getItem('accessToken')

        token ? (config.headers['Authorization'] = "Bearer " + token) : ""
        return config
    })

    ///////////////////::

    // Response interceptor to handle token refresh
    api.interceptors.response.use(
        response => response,

        async error => {
            // recupere la requete original
            // Si il y une erreur et que le status est 401
            if (error.response && error.response.status === 401) {
                const originalRequest = error.config;

                if (!originalRequest._retry) {
                    originalRequest._retry = true;
                }
                // recupere le token dans le local storage
                const refreshToken = localStorage.getItem('refreshToken');

                if (refreshToken) {
                    try {
                        // on execute la requete qui va recupere le nouveau token
                        const result = await refreshTokenFunction(refreshToken);
                        // const result = await axios.post(`${import.meta.env.VITE_API_BASE_URL}auth/refreshToken`,  { refreshToken })

                        localStorage.setItem('accessToken', result.accessToken);
                        localStorage.setItem('refreshToken', result.refreshToken);

                        //on execute la requete original
                        originalRequest.headers['Authorization'] = "Bearer " + result.accessToken;

                        return axios(originalRequest);
                    } catch (error) {
                        console.error('⛔⛔⛔Refresh token failed:', error);
                    }
                } 
            }
            return Promise.reject(error);
        }
    );
    return api
}

async function refreshTokenFunction(refreshToken: string) {

    const headers = { Authorization: `Bearer ${refreshToken}` }

    try {
        const { data } = await axios.post(`${import.meta.env.VITE_API_BASE_URL}auth/refreshToken`, {}, { headers })
        // console.log("👉👉 data from post to refreshToken:" + data);
        return data;
    } catch (error) {
        throw error;
    }
}