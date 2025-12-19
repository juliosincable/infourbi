// src/context/authContextTypes.ts (VERSIÓN CORREGIDA Y FINAL)

import React, { createContext, useContext } from 'react';
// import { User as FirebaseAuthUser } from 'firebase/auth'; // Ya no es necesario importar User de Firebase aquí
import { Usuario } from '../types/types'; 
import { User } from 'firebase/auth'; // Importamos User solo para la función 'register' y 'login'
import { Firestore } from 'firebase/firestore'; 

// --- 1. DEFINICIÓN DEL CONTRATO DE TIPOS (INTERFAZ) ---
export interface AuthContextType {
    // 🛑 CORRECCIÓN CLAVE: El contexto guarda el objeto simplificado 'Usuario', NO el objeto grande de Firebase 'User'.
    currentUser: Usuario | null; 
    userInfo: Usuario | null; 
    loading: boolean;
    isAuthenticated: boolean;
    db: Firestore; // Añadido para que coincida con la implementación en AuthProvider
    
    // Firmas de las funciones del contexto:
    // Las funciones aún devuelven el tipo 'User' de Firebase, ya que es el objeto que retorna la librería.
    login: (correo: string, password: string) => Promise<User>;
    logout: () => Promise<void>;
    register: (data: { nombre: string, email: string, password: string, countryCode?: string }) => Promise<User>;
}


// --- 2. CONTEXTO Y HOOK ---

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext); 
    
    if (context === null) {
        throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
    }
    
    return context;
};