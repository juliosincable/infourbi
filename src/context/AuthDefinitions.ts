// Archivo: src/context/AuthDefinitions.tsx

import { createContext, useContext } from 'react';
import { User } from 'firebase/auth'; 
import { Firestore } from 'firebase/firestore'; 

// --- 1. Interfaz del Contexto ---
export interface AuthContextType {
    currentUser: User | null;
    loading: boolean;
    isAuthenticated: boolean; 
    login: (email: string, pass: string) => Promise<void>; 
    logout: () => Promise<void>; 
    db: Firestore; 
}

// --- 2. Valores por Defecto e Inicialización del Contexto ---
export const defaultAuthContext: AuthContextType = {
    currentUser: null,
    loading: true,
    isAuthenticated: false, 
    login: async () => {}, 
    logout: async () => {}, 
    db: {} as Firestore, 
};

export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

// --- 3. Custom Hook (para consumir el contexto) ---
export const useAuth = () => {
    return useContext(AuthContext);
};