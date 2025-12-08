// Archivo: src/context/Auth.tsx (Versión Final CORREGIDA para bucle de redirección)

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
// FUNCIÓN CRÍTICA CORREGIDA PARA RESOLVER EL BUCLE DE REDIRECCIÓN
// =================================================================

/**
 * Busca los datos adicionales del usuario (nombre, correo) en Firestore
 * y los combina con el UID para formar el objeto Usuario completo.
 * * 🚨 CORRECCIÓN: Si el documento no existe o hay un error, retorna un objeto Usuario 
 * minimal en lugar de null para mantener isAuthenticated=true.
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
        
        // 🛑 PUNTO CRÍTICO DE CORRECCIÓN 1: Si no existe el documento de Firestore, 
        // mantenemos el estado de autenticación.
        console.warn(`[AuthContext] No se encontraron datos de Firestore para el UID: ${uid}. Usando datos mínimos.`);
        return {
            id: uid, 
            nombre: 'Usuario Genérico', 
            correo: 'Correo no cargado',
        } as Usuario; 

    } catch (error) {
        console.error("Error al obtener datos del usuario de Firestore. Asumiendo autenticación Firebase exitosa:", error);
        
        // 🛑 PUNTO CRÍTICO DE CORRECCIÓN 2: Si hay un error, mantenemos el estado de autenticación.
        return {
            id: uid, 
            nombre: 'Error de Carga', 
            correo: 'Error de Carga',
        } as Usuario;
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
                // Obtenemos el perfil completo desde Firestore (ahora garantizado que no será null si user existe)
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