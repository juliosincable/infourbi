import React from 'react';
import { User, Auth } from 'firebase/auth';

// 1. Definir la interfaz (FINALMENTE CORREGIDA con authInstance)
export interface AuthContextType {
    currentUser: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
    // PROPIEDAD REQUERIDA POR EL PROVIDER:
    authInstance: Auth;
}

// 2. Crear el Contexto
export const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

// 3. Crear y exportar el Hook useAuth
export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};

// CÓDIGO IMPLEMENTADO EN EL ARCHIVO COMPLETO: src/context/AuthContext.ts