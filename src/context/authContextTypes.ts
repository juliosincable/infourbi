// src/context/authContextTypes.ts

import React, { createContext, useContext } from 'react';
import { User as FirebaseAuthUser } from 'firebase/auth';
import { Usuario } from '../types/types'; 
// Asume que también tienes RegisterData aquí o donde se necesite

// --- 1. DEFINICIÓN DEL CONTRATO DE TIPOS ---
export interface AuthContextType {
    currentUser: FirebaseAuthUser | null;
    userInfo: Usuario | null; // El perfil de segundo grado de Firestore
    loading: boolean;
    isAuthenticated: boolean;
    
    // Firmas de las funciones del contexto:
    login: (correo: string, password: string) => Promise<FirebaseAuthUser>;
    logout: () => Promise<void>;
    register: (data: { nombre: string, email: string, password: string, countryCode?: string }) => Promise<FirebaseAuthUser>;
}


// --- 2. CONTEXTO Y HOOK ---

// ✅ CORRECCIÓN TS/ESLINT: El contexto debe permitir ser null en su estado inicial.
// Ya no usamos 'any'.
export const AuthContext = createContext<AuthContextType | null>(null);

// El hook useAuth: Garantiza que el contexto no sea null y devuelve el tipo correcto.
export const useAuth = () => {
    const context = useContext(AuthContext); 
    
    // Si el contexto es null, significa que el componente está fuera del AuthProvider
    if (context === null) {
        throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
    }
    
    // Ahora TypeScript sabe que 'context' es AuthContextType
    return context;
};