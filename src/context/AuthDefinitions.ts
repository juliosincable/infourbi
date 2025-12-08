// Archivo: src/context/AuthDefinitions.ts (VERSIÓN FINAL CORREGIDA)

import { createContext, useContext } from 'react';
// 🛑 CORRECCIÓN 1: Importar SOLAMENTE el TIPO 'Firestore'
import { Firestore } from 'firebase/firestore'; 

// 🛑 Importación ÚNICA de Usuario desde el archivo de tipos
import { Usuario } from '../types/types'; 

// --- 1. Interfaz del Contrato del Contexto ---
export interface AuthContextType {
    currentUser: Usuario | null; 
    loading: boolean;
    isAuthenticated: boolean;
    login: (email: string, pass: string) => Promise<void>; 
    logout: () => Promise<void>; 
    db: Firestore; // Ahora usa el tipo Firestore
}

// --- 2. Valores por Defecto e Inicialización del Contexto ---
export const defaultAuthContext: AuthContextType = {
    currentUser: null,
    loading: true,
    isAuthenticated: false, 
    login: async () => {}, 
    logout: async () => {}, 
    db: {} as Firestore, // Valor dummy para cumplir el contrato
};

export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

// --- 3. Custom Hook ---
export const useAuth = () => {
    // Implementación del hook (mejorada para detectar uso fuera del Provider)
    const context = useContext(AuthContext);
    
    if (context === defaultAuthContext) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider'); 
    }
    
    return context;
};

// 🛑 CORRECCIÓN 2: Reexportar el tipo Usuario para que Auth.tsx pueda importarlo
export type { Usuario };