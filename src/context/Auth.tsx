// Archivo: src/context/Auth.tsx (Versión Final COMPLETA y sin errores de sintaxis/tipo)

import React, { useEffect, useState, ReactNode } from 'react';
import {
    // Importaciones de tipos y funciones necesarias de Firebase Auth
    User,
    onAuthStateChanged,
    signOut,
    signInWithEmailAndPassword,
} from 'firebase/auth';
import { Firestore, doc, getDoc } from 'firebase/firestore'; // Importamos funciones de Firestore

// 1. IMPORTAMOS LAS INSTANCIAS INICIALIZADAS DE AUTH Y FIRESTORE
import { auth, db } from '../service/firebaseConfig';


// Importación de elementos de definición de contexto, incluyendo el tipo Usuario
import { AuthContext, AuthContextType, Usuario } from './AuthDefinitions';


// *****************************************************************
// ** EXPORTACIONES NECESARIAS PARA EL BARREL FILE (index.ts) **
// *****************************************************************

export { AuthContext };
export type { AuthContextType };


// =================================================================
// FUNCIÓN CRÍTICA PARA RESOLVER EL ERROR TS2322
// =================================================================

/**
 * Busca los datos adicionales del usuario (nombre, correo) en Firestore
 * y los combina con el UID para formar el objeto Usuario completo.
 */
const fetchUserData = async (uid: string): Promise<Usuario | null> => {
    try {
        // Busca en la colección 'users' el documento con el ID igual al UID del usuario
        const userRef = doc(db as unknown as Firestore, 'users', uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
            const firestoreData = docSnap.data();
            
            // Creamos el objeto Usuario que cumple estrictamente con el contrato
            const usuarioCompleto: Usuario = {
                id: uid, 
                nombre: firestoreData.nombre || 'Nombre no configurado', 
                correo: firestoreData.correo || 'Correo no disponible',
            };
            return usuarioCompleto;
        }
        
        return null; 
    } catch (error) {
        console.error("Error al obtener datos del usuario de Firestore:", error);
        return null;
    }
};

// --- Componente Proveedor (AuthProvider) ---
interface AuthProviderProps {
    children: ReactNode;
}

// EXPORTAMOS SOLO EL COMPONENTE PRINCIPAL
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    // ESTADO CORREGIDO: Almacena Usuario | null
    const [currentUser, setCurrentUser] = useState<Usuario | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Listener de autenticación, ahora ASÍNCRONO
        const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
            setLoading(true);

            if (user) {
                // Obtenemos el perfil completo desde Firestore
                const usuarioCompleto = await fetchUserData(user.uid);
                setCurrentUser(usuarioCompleto); 
            } else {
                setCurrentUser(null);
            }
            
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    // Función de Autenticación - LOGIN
    const login = async (email: string, pass: string) => {
        await signInWithEmailAndPassword(auth, email, pass);
    };

    // Función de Autenticación - LOGOUT
    const logout = () => {
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
        db: db as unknown as Firestore,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};