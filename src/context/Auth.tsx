// src/context/Auth.tsx (VERSIÓN FINAL Y COMPLETA)

import React, { useEffect, useState, ReactNode } from 'react';
import { 
    onAuthStateChanged,
    User as FirebaseAuthUser,
} from 'firebase/auth';

import { AuthContext, AuthContextType } from './authContextTypes'; 

// Importar la instancia de Auth para onAuthStateChanged
import { auth } from '../service/firebaseConfig'; 

// Importación del Servicio AUTH (asumiendo que está en la misma carpeta o adyacente)
import { 
    register,
    login,
    logout
} from './authService'; 

// Importar la función para OBTENER el perfil de Firestore
import { getUserProfile } from '../service/database'; 

import { Usuario } from '../types/types'; 

// =========================================================
// EL COMPONENTE PROVIDER (AuthProvider)
// =========================================================

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<FirebaseAuthUser | null>(null);
    const [userInfo, setUserInfo] = useState<Usuario | null>(null);
    const [loading, setLoading] = useState(true);

    const isAuthenticated = !!currentUser && !!userInfo;

    // Función auxiliar para cargar el perfil de Firestore
    const loadUserProfile = async (user: FirebaseAuthUser) => {
        try {
            const profile = await getUserProfile(user.uid); 
            setUserInfo(profile);
        } catch (error) {
            console.error('Error cargando perfil de usuario:', error);
            setUserInfo(null);
        }
    };
    
    // useEffect para manejar el cambio de estado de Auth y la carga del perfil
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
    
    // --- MANEJADORES DE SESIÓN (Llaman al Servicio y DEVUELVEN el User) ---

    // Login: Debe devolver Promise<FirebaseAuthUser> para cumplir el contrato
    const handleLogin = async (correo: string, password: string): Promise<FirebaseAuthUser> => {
        setLoading(true);
        
        try {
            const user = await login(correo, password); 
            
            setCurrentUser(user);
            await loadUserProfile(user); 

            // ✅ CORRECCIÓN TS2322: DEVOLVER EL OBJETO USER
            return user; 
            
        } finally {
             setLoading(false);
        }
    };
    
    // Logout: Usa el servicio 
    const handleLogout = async () => {
        await logout(); 
    };

    // Registro: Debe devolver Promise<FirebaseAuthUser> para cumplir el contrato
    const handleRegister = async (data: { nombre: string, correo: string, password: string, countryCode?: string }): Promise<FirebaseAuthUser> => {
        setLoading(true);

        try {
            const user = await register(data); 
            
            setCurrentUser(user);
            await loadUserProfile(user); 

            // ✅ CORRECCIÓN TS2322: DEVOLVER EL OBJETO USER
            return user;
            
        } finally {
            setLoading(false);
        }
    };

    // El objeto de valor para el contexto
    const value: AuthContextType = {
        currentUser,
        userInfo, 
        loading,
        isAuthenticated, 
        login: handleLogin,
        logout: handleLogout,
        register: handleRegister,
    };

    return (
        <AuthContext.Provider value={value}>
            {/* Solo renderiza los hijos cuando la autenticación inicial ha terminado */}
            {!loading && children} 
        </AuthContext.Provider>
    );
};