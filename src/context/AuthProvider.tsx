// src/context/AuthProvider.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    signOut,
    User // Tipo de usuario de Firebase
} from 'firebase/auth'; 
import { doc, getDoc, Timestamp } from 'firebase/firestore'; // Importamos Timestamp si es necesario

// Importamos el contrato, el hook y el contexto desde el archivo de definiciones
import { 
    AuthContext, 
    AuthContextType, 
    defaultAuthContext, 
} from './AuthDefinitions'; 
// Asegúrate de que este tipo ahora incluya 'uid: string' y 'email: string'
import { Usuario } from '../types/types'; 
import { auth, db } from '../service/firebaseConfig'; 

// ----------------------------------------------------------------------
// ✅ CORRECCIÓN TS2339 / ESLINT: Usamos React.PropsWithChildren
// ----------------------------------------------------------------------

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    
    // Inicializamos el estado del contexto
    const [contextValue, setContextValue] = useState<AuthContextType>({
        ...defaultAuthContext, 
        db: db 
    });
    
    // --- 1. FUNCIÓN CRÍTICA: Lógica de Autenticación de Firebase ---

    useEffect(() => {
        // Establecer loading en true al inicio de la verificación (solo al montar)
        setContextValue(prev => ({ ...prev, loading: true }));
            
        const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {

            if (user) {
                // Si el usuario está logueado, buscamos sus datos de perfil y rol en Firestore.
                const userDocRef = doc(db, 'usuarios', user.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    // 🎯 Combinar datos de Auth (uid, email) y Firestore (role, etc.)
                    const userData = userDoc.data(); 
                    
                    // Manejo de email que puede ser null en Firebase
                    const emailString = user.email || ''; 

                    // ✅ CORRECCIÓN TS2353: 'uid' y 'email' ahora coinciden con la interfaz
                    const loadedUser: Usuario = {
                        uid: user.uid, 
                        email: emailString, 
                        
                        // Asignar los campos de Firestore (requieren casting de tipo)
                        nombre: (userData.nombre as string) || '', // Campo obligatorio de Usuario
                        role: (userData.role as Usuario['role']) || 'user', 
                        countryCode: (userData.countryCode as string) || 'VE',
                        createdAt: userData.createdAt as Timestamp, 
                        // ... otros campos obligatorios
                    };

                    setContextValue(prev => ({
                        ...prev,
                        currentUser: loadedUser,
                        isAuthenticated: true,
                        loading: false, 
                    }));
                } else {
                    console.warn("Usuario autenticado sin documento de perfil en Firestore. Cerrando sesión...");
                    signOut(auth); 
                    setContextValue(prev => ({
                        ...prev,
                        currentUser: null,
                        isAuthenticated: false,
                        loading: false,
                    }));
                }

            } else {
                // Si NO hay usuario logueado
                setContextValue(prev => ({
                    ...prev,
                    currentUser: null,
                    isAuthenticated: false,
                    loading: false, 
                }));
            }
        });

        // Cleanup function
        return () => unsubscribe(); 
        
    // ✅ CORRECCIÓN ESLINT: Dependencias estáticas (auth, db) no son necesarias aquí.
    }, []); 

    // --- 2. Implementación de los Métodos (Login/Logout) ---

    const login = useCallback(async (email: string, pass: string): Promise<void> => {
        try {
            await signInWithEmailAndPassword(auth, email, pass);
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            throw error; 
        }
    }, []);

    const logout = useCallback(async (): Promise<void> => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
            throw error;
        }
    }, []);
    
    // 🎯 Creamos el valor final, inyectando los métodos para el contrato
    const finalContextValue: AuthContextType = {
        ...contextValue,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={finalContextValue}>
            {children}
        </AuthContext.Provider>
    );
};