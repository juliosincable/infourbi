import React, { useState, useEffect, useCallback, useContext } from 'react';
import { 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    signOut,
    User,
    createUserWithEmailAndPassword 
} from 'firebase/auth'; 
import { doc, getDoc, setDoc, Timestamp, Firestore } from 'firebase/firestore'; 
import { AuthContext, AuthContextType } from './authContextTypes';
import { Usuario } from '../types/types'; 
import { auth, db } from '../service/firebaseConfig'; 

interface AuthInternalState {
    currentUser: Usuario | null;
    userInfo: Usuario | null;
    loading: boolean;
    isAuthenticated: boolean;
    db: Firestore;
}

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    
    const [contextState, setContextState] = useState<AuthInternalState>({ 
        currentUser: null,
        userInfo: null,
        loading: true, 
        isAuthenticated: false,
        db: db 
    });
    
    const login = useCallback(async (email: string, pass: string): Promise<User> => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, pass);
            return userCredential.user;
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

    const register = useCallback(async (data: { 
        nombre: string, 
        email: string, 
        password: string, 
        countryCode?: string 
    }): Promise<User> => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
            const user = userCredential.user;

            const nuevoUsuario: Usuario = {
                uid: user.uid,
                email: data.email,
                nombre: data.nombre,
                role: 'user', 
                countryCode: data.countryCode || 'VE',
                createdAt: Timestamp.now(),
            };

            await setDoc(doc(db, 'usuarios', user.uid), nuevoUsuario);
            return user;
        } catch (error) {
            console.error("Error al registrar usuario:", error);
            throw error;
        }
    }, []);

    useEffect(() => {
        // 1. Iniciamos el detector de tiempo muerto (Failsafe)
        // Se usa const directamente para evitar el error 'prefer-const'
        const timeoutId = setTimeout(() => {
            setContextState(prev => {
                if (prev.loading) {
                    console.warn("AuthProvider: Timeout alcanzado. Forzando renderizado.");
                    return { ...prev, loading: false };
                }
                return prev;
            });
        }, 15000);

        // 2. Escuchamos el cambio de estado de Firebase
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            try {
                if (user) {
                    const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
                    let userData: Usuario;

                    if (userDoc.exists()) {
                        userData = userDoc.data() as Usuario;
                    } else {
                        userData = {
                            uid: user.uid,
                            email: user.email || '',
                            nombre: 'Usuario infoUrbi',
                            role: 'user',
                            countryCode: 'VE',
                            createdAt: Timestamp.now()
                        };
                    }
                    
                    // Si Firebase responde, el timeout se limpia aquí
                    clearTimeout(timeoutId);
                    setContextState(prev => ({
                        ...prev,
                        currentUser: userData,
                        isAuthenticated: true,
                        loading: false
                    }));
                } else {
                    clearTimeout(timeoutId);
                    setContextState(prev => ({
                        ...prev,
                        currentUser: null,
                        isAuthenticated: false,
                        loading: false
                    }));
                }
            } catch (error) {
                console.error("Error en AuthProvider useEffect:", error);
                clearTimeout(timeoutId);
                setContextState(prev => ({ ...prev, loading: false }));
            }
        });

        return () => {
            unsubscribe();
            clearTimeout(timeoutId);
        };
    }, []);
    
    const finalContextValue: AuthContextType = {
        ...contextState,
        login,
        logout,
        register,
    };

    return (
        <AuthContext.Provider value={finalContextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// Se añade esta línea para silenciar la advertencia de Fast Refresh de Vite
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe ser usado dentro de un AuthProvider");
    }
    return context;
};