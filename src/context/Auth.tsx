// src/context/Auth.tsx (VERSIÓN CORREGIDA PARA BUILD)

import React, { useEffect, useState, ReactNode } from 'react';
import { 
    onAuthStateChanged,
    User as FirebaseAuthUser,
} from 'firebase/auth';

import { AuthContext, AuthContextType } from './authContextTypes'; 
import { auth, db } from '../service/firebaseConfig'; 
import { register, login, logout } from './authService'; 
import { getUserProfile } from '../service/database'; 
import { Usuario } from '../types/types'; 

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<FirebaseAuthUser | null>(null);
    const [userInfo, setUserInfo] = useState<Usuario | null>(null);
    const [loading, setLoading] = useState(true);

    const isAuthenticated = !!currentUser && !!userInfo;

    const loadUserProfile = async (user: FirebaseAuthUser) => {
        try {
            const profile = await getUserProfile(user.uid); 
            setUserInfo(profile);
        } catch (error) {
            console.error('Error cargando perfil de usuario:', error);
            setUserInfo(null);
        }
    };
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            if (user) {
                await loadUserProfile(user); 
            } else {
                setUserInfo(null); 
            }
            setLoading(false);
        });
        return unsubscribe;
    }, []);
    
    const handleLogin = async (email: string, password: string): Promise<FirebaseAuthUser> => {
        setLoading(true);
        try {
            const user = await login(email, password); 
            setCurrentUser(user);
            await loadUserProfile(user); 
            return user; 
        } finally {
             setLoading(false);
        }
    };
    
    const handleLogout = async () => {
        await logout(); 
    };

    const handleRegister = async (data: { nombre: string, email: string, password: string, countryCode?: string }): Promise<FirebaseAuthUser> => {
        setLoading(true);
        try {
            const user = await register(data); 
            setCurrentUser(user);
            await loadUserProfile(user); 
            return user;
        } finally {
            setLoading(false);
        }
    };

    // ✅ CORRECCIÓN TS2304: Usamos las variables que realmente existen en este componente
    const finalContextValue: AuthContextType = {
        currentUser: userInfo, // Pasamos el perfil de infoUrbi
        userInfo: userInfo,
        loading: loading,
        isAuthenticated: isAuthenticated,
        db: db, // Importado de firebaseConfig
        login: handleLogin,
        logout: handleLogout,
        register: handleRegister,
    };

    return (
        <AuthContext.Provider value={finalContextValue}>
            {/* Solo renderiza los hijos cuando la autenticación inicial ha terminado */}
            {!loading && children} 
        </AuthContext.Provider>
    );
};