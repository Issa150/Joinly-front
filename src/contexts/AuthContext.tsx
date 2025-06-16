// src/contexts/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { checkAuthentication, logoutApi } from '../api/auth';
import { useLocation, useNavigate } from 'react-router-dom';

interface AuthContextType {
    firstname: string | null;
    role: string | null;
    profileImg: string | null;
    setAuthData: (data: { firstname: string; role: string; profileImg: string }) => void;
    clearAuthData: () => void;
    isAuthenticated: boolean;
    loginContext: (data: { firstname: string; role: string; profileImg: string }) => void;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [firstname, setFirstname] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [profileImg, setProfileImg] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const navigate = useNavigate();
    const location = useLocation();
    const publicRoutes = ["/", "/eventlist", "/signup", "/login", "/resend-confirmation-email", "/forgot-password"]


    // Function to reset AuthContext data Locally, is recalled on logout()
    const clearAuthData = ():void => {
        setFirstname(null);
        setRole(null);
        setProfileImg(null);
        setIsAuthenticated(false);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    };

    // checking if user is authenticated even inpage refresh
    useEffect((): void => {
        const checkAuth = async () => {
            if (location.pathname === '/signin') { // Prevent check on login page
                return;
            }
            const token = localStorage.getItem('accessToken');
            if (!token) {
                setIsAuthenticated(false);
                clearAuthData();

                // Dynamic routes that are public
                const isPublicRoute = publicRoutes.includes(location.pathname) ||
                    /^\/event\/\d+$/.test(location.pathname) ||
                    /^\/activate-account\/[^/]+$/.test(location.pathname) ||
                    /^\/reset-password\/[^/]+$/.test(location.pathname);

                if (!isPublicRoute) {
                    setIsAuthenticated(false);
                    clearAuthData();
                    // if (!isPublicRoute) {
                    //     navigate('/signin');
                    // }
                    setTimeout(() => {
                        // const isPublicRoute = /* your public route check */
                        if (!isPublicRoute) {
                            // navigate('/signin');
                        }
                    }, 1000); // 1 second delay
                }
                return;
            }
            try {
                const profileData = await checkAuthentication();
                if (profileData) {
                    loginContext(profileData);
                } else {
                    console.error('Failed to get profile data');
                    clearAuthData();
                }
            } catch (error: any) {

                console.error('Initial auth check failed:', error);
                clearAuthData();
            }
        };
        checkAuth();
    }, [location, navigate]);

    const setAuthData = (data: { firstname: string; role: string; profileImg: string }):void => {
        setFirstname(data.firstname);
        setRole(data.role);
        setProfileImg(import.meta.env.VITE_API_BASE_URL + "media/uploads/" + data.profileImg);
        
        setIsAuthenticated(true);
    };

    // this is the fucntion avaliable to login the user on login page
    const loginContext = (data: { firstname: string; role: string; profileImg: string }):void => { // Change to accept data
        setAuthData(data); // Call setAuthData with the received data
    };
    // this is the function available to logout the user on any page
    const logout = async ():Promise<void> => {
        try {
            await logoutApi(); // Use the logout function from authApi
        } catch (error) {
            console.error('Logout API call failed:', error);
        }
        clearAuthData();
    };

    const value: AuthContextType = {
        firstname,
        role,
        profileImg,
        setAuthData,
        clearAuthData,
        isAuthenticated,
        loginContext,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};