// Archivo: src/context/Auth.tsx (Versión Limpia, Final y con instancias inicializadas)

import React, { useEffect, useState, ReactNode } from 'react';
import {
    // Importaciones de tipos y funciones necesarias
    User,
    onAuthStateChanged,
    signOut,
    signInWithEmailAndPassword,
} from 'firebase/auth';
import { Firestore } from 'firebase/firestore'; // Importamos el tipo Firestore de la SDK

// 1. IMPORTAMOS LAS INSTANCIAS INICIALIZADAS DE AUTH Y FIRESTORE
// Esto asegura que initializeApp() ya se ejecutó en '../firebase'

import { auth, db } from '../service/firebaseConfig';


// Importación de elementos de definición de contexto:
// NOTA IMPORTANTE: Asegúrese de que AuthContextType incluye 'db: Firestore'
import { AuthContext, AuthContextType } from './AuthDefinitions';


// *****************************************************************
// ** EXPORTACIONES NECESARIAS PARA EL BARREL FILE (index.ts) **
// *****************************************************************

export { AuthContext };
export type { AuthContextType };


// --- Componente Proveedor (AuthProvider) ---
interface AuthProviderProps {
    children: ReactNode;
}

// EXPORTAMOS SOLO EL COMPONENTE PRINCIPAL
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Utilizamos la instancia 'auth' importada.

    useEffect(() => {
        // Establece el listener de autenticación usando la instancia 'auth' importada
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });
        // La dependencia es un arreglo vacío ([]) porque 'auth' es una constante importada y no cambia
        return unsubscribe;
    }, []);

    // Función de Autenticación - LOGIN
    const login = async (email: string, pass: string) => {
        // Usa la instancia 'auth' importada
        await signInWithEmailAndPassword(auth, email, pass);
    };

    // Función de Autenticación - LOGOUT
    const logout = () => {
        // Usa la instancia 'auth' importada
        return signOut(auth);
    };

    // Calculamos isAuthenticated
    const isAuthenticated = !!currentUser;

    // Valores proporcionados al Contexto
    const value: AuthContextType = {
        currentUser,
        loading,
        isAuthenticated,
        login,
        logout,
        // AGREGAMOS FIRESTORE (db) AL CONTEXTO, usando aserciones de tipo para compatibilidad
        db: db as unknown as Firestore,
    };

    return (
        <AuthContext.Provider value={value}>
            {/* Solo renderiza los hijos cuando la autenticación ha terminado de cargar */}
            {!loading && children}
        </AuthContext.Provider>
    );
};