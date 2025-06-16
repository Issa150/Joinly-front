// src/api/authApi.ts
import { useApi } from '../hooks/useApi';
import { LoginResponse, SignUpFormInterface } from '../interface/AuthTypes';
import { SimpleProfileType } from '../interface/ProfileTypes';




// export const login = async (email: string, password: string): Promise<LoginResponse> => {
export const login = async (email: string, password: string) => {
    try {
        const api = useApi();
        const response = await api.post<LoginResponse>(`${import.meta.env.VITE_API_BASE_URL}auth/signin`, {
            email,
            password,
        });
        return response; // The access tokens!!!!!!!!!!!
    } catch (error: any) {
        console.error('Auth Api: -- Login error:', error.response ? error.response.data : error.message);
        throw error.response.data;
    }
};


export const signup = async (data: SignUpFormInterface) => {
    try {
        const api = useApi();
        return await api.post(`${import.meta.env.VITE_API_BASE_URL}auth/signup`, data);
    } catch (error: any) {
        console.error('Signup error:', error.response ? error.response.data : error.message);
        throw error.response.data;
    }
};

export async function checkAuthentication():Promise<SimpleProfileType | null> {
    try {
        const api = useApi();
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}profile/basic`);
        return {
            firstname: response.data.firstname,
            role: response.data.role,
            profileImg: response.data.profileImg,
        };
    } catch (error) {
        return null;
    }
}

export const logoutApi = async () => {
    try {
        const api = useApi();
        await api.delete(`${import.meta.env.VITE_API_BASE_URL}auth/logout`);
    } catch (error: any) {
        console.error('Logout error:', error.response ? error.response.data : error.message);
        throw error.response.data;
    }
};

export const activateAccount = async (token: string) => {
    try {
        const api = useApi();
        const response = await api.put(`auth/activate-account/${token}`);
        return response.data; // Assuming the response contains the data you need
    } catch (error) {
        throw error; // Rethrow the error to handle it in the component
    }
};

export const resendVerificationEmail = async (email: string) => {
    try {
        const api = useApi();
        const response = await api.post(`auth/resend-verification`, { email });
        return response.data;
    } catch (error: any) {
        console.error('Resend verification email error:', error.response ? error.response.data : error.message);
        throw error.response.data;
    }
};

export const forgotPassword = async (email: string): Promise<{ message: string }> => {
    try {
        const api = useApi();
        const response = await api.post<{ message: string }>(`auth/forgot-password`, { email });
        return response.data;
    } catch (error: any) {
        console.error('Forgot password error:', error.response ? error.response.data : error.message);
        throw error.response.data;
    }
};

export const resetPassword = async (token: string, newPassword: string, repeatNewPassword: string): Promise<{ message: string }> => {
    try {
        const api = useApi();
        const response = await api.put<{ message: string }>(`auth/reset-password/${token}`, { newPassword, repeatNewPassword });
        return response.data;
    } catch (error: any) {
        console.error('Reset password error:', error.response ? error.response.data : error.message);
        throw error.response.data;
    }
};