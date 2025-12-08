// Archivo: src/context/Auth.tsx (Refactorizado)

import React, { useEffect, useState, ReactNode } from 'react';
import {
    User,
    onAuthStateChanged,
    signOut,
    signInWithEmailAndPassword,
} from 'firebase/auth';
import { Firestore, doc, getDoc } from 'firebase/firestore'; 

import { auth, db } from '../service/firebaseConfig';
// Importamos la función getDocumentById y la referencia de colección del servicio anterior
import { getDocumentById, usuariosCollection } from '../service/database'; 

import { AuthContext, AuthContextType, Usuario } from './AuthDefinitions';

export { AuthContext };
export type { AuthContextType };

// --- Tipo de la instancia de Firestore para evitar casteos repetidos ---
const typedDB: Firestore = db as unknown as Firestore;

/**
 * Busca los datos adicionales del usuario (nombre, correo) en Firestore
 * y los combina con el UID para formar el objeto Usuario completo.
 * Retorna siempre un objeto Usuario (completo o minimal) si el UID es válido.
 */
const fetchUserData = async (uid: string): Promise<Usuario> => {
    try {
        // Mejor práctica: Usar la función de servicio que ya tiene el tipado de la colección
        const usuarioCompleto = await getDocumentById<Usuario>(usuariosCollection, uid);

        if (usuarioCompleto) {
            return usuarioCompleto;
        }
        
        // Si no existe el documento de Firestore, retornamos datos mínimos
        console.warn(`[AuthContext] No se encontraron datos de Firestore para el UID: ${uid}. Usando datos mínimos.`);
        return {
            id: uid, 
            nombre: 'Usuario Genérico', 
            correo: 'Correo no cargado',
        } as Usuario; 

    } catch (error) {
        console.error("Error al obtener datos del usuario de Firestore.", error);
        
        // Si hay un error, retornamos datos de error
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

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<Usuario | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
            setLoading(true);

            if (user) {
                // Obtenemos el perfil completo desde Firestore (siempre retorna Usuario, nunca null si user existe)
                const usuarioCompleto = await fetchUserData(user.uid);
                setCurrentUser(usuarioCompleto); 
            } else {
                setCurrentUser(null);
            }
            
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const login = async (email: string, pass: string) => {
        await signInWithEmailAndPassword(auth, email, pass);
    };

    const logout = () => {
        return signOut(auth);
    };

    const isAuthenticated = !!currentUser;

    const value: AuthContextType = {
        currentUser,
        loading,
        isAuthenticated,
        login,
        logout,
        db: typedDB, // Usamos la instancia tipada
    };

    // Sugerencia C: Si `loading` es true, deberías mostrar una pantalla de carga global.
    if (loading) {
        // En una PWA, un splash screen o IonSpinner ocupa este lugar.
        // Aquí puedes poner un componente que cubra toda la pantalla.
        return (
            <AuthContext.Provider value={value}>
                {/* Opcional: <IonLoading isOpen={true} message="Cargando sesión..." /> */}
                <div style={{ padding: '20px', textAlign: 'center' }}>Cargando autenticación...</div>
            </AuthContext.Provider>
        );
    }


    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};