// src/context/AuthDefinitions.ts

import { createContext, useContext } from 'react';
import { Firestore } from 'firebase/firestore'; 
import { Usuario } from '../types/types'; 

// 1. Interfaz de ESTADO MUTABLE (Lo que maneja useState)
export interface AuthStateType {
    currentUser: Usuario | null;
    loading: boolean;
    isAuthenticated: boolean;
    db: Firestore;
}

// 2. Interfaz del CONTRATO COMPLETO (Lo que usa toda la App)
// 🎯 SOLUCIÓN: Extiende el estado y añade las funciones
export interface AuthContextType extends AuthStateType {
    login: (email: string, pass: string) => Promise<void>; 
    logout: () => Promise<void>; 
}

// 3. Inicialización del Contexto con 'undefined'
export const AuthContext = createContext<AuthContextType | undefined>(undefined); 

// 4. Custom Hook (usa AuthContextType)
export const useAuth = () => {
    const context = useContext(AuthContext);
    
    if (context === undefined) { 
        throw new Error('useAuth debe usarse dentro de un AuthProvider'); 
    }
    
    return context;
};

export type { Usuario };