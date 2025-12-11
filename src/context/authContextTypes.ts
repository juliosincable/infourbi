// src/context/authContextTypes.ts
// Contiene la Interfaz, el Contexto de React y el Hook useAuth (para cumplir con Fast Refresh).

import React, { createContext, useContext } from 'react';
import { User as FirebaseAuthUser } from 'firebase/auth';
import { Usuario } from '../types/types'; 

// =========================================================
// 1. DEFINICIÓN DEL TIPO DE CONTEXTO
// =========================================================

export interface AuthContextType {
    currentUser: FirebaseAuthUser | null;
    userInfo: Usuario | null;
    loading: boolean;
    login: (correo: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    register: (nombre: string, correo: string, password: string, countryCode?: string) => Promise<void>;
}

// =========================================================
// 2. CREACIÓN DEL OBJETO CONTEXTO
// =========================================================

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// =========================================================
// 3. EXPORTAMOS EL HOOK (MOVIDO)
// =========================================================

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context as AuthContextType;
};