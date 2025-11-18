import React, { useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  Auth,
} from 'firebase/auth';
// RUTA CORREGIDA: Apunta a la carpeta 'service'
import { auth } from '../service/firebaseConfig';
import { AuthContext, AuthContextType } from './AuthContext'; // Importa la interfaz y el contexto

// --- Definición de Props para el Provider ---

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Efecto para manejar la persistencia de la sesión
  useEffect(() => {
    // 1. Manejar la suscripción a Firebase Auth. Esto solo se ejecuta una vez.
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      // Solo establecemos loading en false DESPUÉS de recibir el estado inicial de Firebase.
      setLoading(false);
    });
    // 2. Función de limpieza (cleanup) para desmontar el listener.
    return () => unsubscribe();
  }, []); // El array de dependencias vacío asegura que se ejecute solo al montar.

  // --- Implementación de las Funciones (Estabilizadas con useCallback) ---
  
  // Usar useCallback para que estas funciones NO cambien en cada renderizado
  const login = useCallback(async (email: string, password: string): Promise<void> => {
    await signInWithEmailAndPassword(auth, email, password);
  }, []); // Dependencias vacías: auth es estable.

  const register = useCallback(async (email: string, password: string): Promise<void> => {
    await createUserWithEmailAndPassword(auth, email, password);
  }, []); // Dependencias vacías.
  
  const loginWithGoogle = useCallback(async (): Promise<void> => {
    // Implementación pendiente
  }, []); // Dependencias vacías.

  const logout = useCallback(async (): Promise<void> => {
    await signOut(auth);
  }, []); // Dependencias vacías.

  // --- Objeto de Valor del Contexto (Memorizado con useMemo) ---
  // useMemo asegura que el objeto 'value' SOLO se recree cuando cambien las dependencias.
  const value: AuthContextType = useMemo(() => ({
    currentUser,
    loading,
    login,
    register,
    loginWithGoogle,
    logout,
    authInstance: auth, // 'auth' es estable
  }), [currentUser, loading, login, register, loginWithGoogle, logout]);

  // Si decides usar un indicador de carga (spinner), puedes hacerlo aquí:
  // if (loading) {
  //   return <div>Cargando autenticación...</div>;
  // }

  return (
    <AuthContext.Provider value={value}>
      {children} 
    </AuthContext.Provider>
  );
};