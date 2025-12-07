// Archivo: src/context/AuthDefinitions.ts (Completamente limpio y funcional)

import { createContext, useContext } from 'react';
import { Firestore } from 'firebase/firestore'; 

// Importación de Usuario desde el archivo de tipos
import { Usuario } from '../types/types'; 

// SOLUCIÓN AL ERROR TS2459: Reexportamos la interfaz Usuario.
export type { Usuario }; 

// --- 1. Interfaz del Contexto ---
export interface AuthContextType {
    currentUser: Usuario | null; 
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