// src/context/Auth.tsx
// Contiene la lógica de Firebase y el componente AuthProvider (única exportación de componente).

import React, { useEffect, useState, ReactNode } from 'react';
import { 
    User as FirebaseAuthUser,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
} from 'firebase/auth';
import { serverTimestamp, FieldValue } from 'firebase/firestore'; 

import { AuthContext, AuthContextType } from './authContextTypes'; 

// Importaciones de servicio (Asegúrate que estas rutas existan)
import { auth } from '../service/firebaseConfig';
import { usuariosCollection, setDocumentById } from '../service/database';
import { Usuario } from '../types/types'; 

// =========================================================
// LÓGICA DE REGISTRO
// =========================================================

const createAndRegisterUser = async (
    nombre: string,
    correo: string,
    password: string,
    countryCode: string = 'VE'
): Promise<FirebaseAuthUser> => {
    
    const userCredential = await createUserWithEmailAndPassword(auth, correo, password);
    const user = userCredential.user;

    const initialUserData: Omit<Usuario, 'id'> = {
        nombre: nombre, 
        correo: user.email!, 
        role: 'user', 
        countryCode: countryCode, 
        createdAt: serverTimestamp() as FieldValue, 
    };

    await setDocumentById(usuariosCollection, user.uid, initialUserData);
    return user;
};

// =========================================================
// EL COMPONENTE PROVIDER
// =========================================================

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<FirebaseAuthUser | null>(null);
    const [userInfo, setUserInfo] = useState<Usuario | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });
        return unsubscribe;
    }, []);
    
    const handleLogin = async (correo: string, password: string) => {
        setLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, correo, password);
            setCurrentUser(userCredential.user);
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    const handleLogout = async () => {
        await signOut(auth);
        setCurrentUser(null);
        setUserInfo(null);
    };

    const handleRegister = async (nombre: string, correo: string, password: string, countryCode?: string) => {
        setLoading(true);
        try {
            const user = await createAndRegisterUser(nombre, correo, password, countryCode);
            setCurrentUser(user);
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    const value: AuthContextType = {
        currentUser,
        userInfo,
        loading,
        login: handleLogin,
        logout: handleLogout,
        register: handleRegister,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};