// src/context/authService.ts

import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    updateProfile, 
    User as FirebaseAuthUser,
} from "firebase/auth";

import { serverTimestamp, FieldValue } from "firebase/firestore"; 

import { auth } from "../service/firebaseConfig";

import { Usuario } from "../types/types"; 

import { setDocumentById, usuariosCollection } from "../service/database"; 


// --- TIPOS LOCALES PARA EL SERVICIO ---
// ✅ CORRECCIÓN TS2353: Cambiamos 'correo' a 'email'
type RegisterData = { 
    nombre: string; 
    email: string; // <--- CORREGIDO
    password: string; 
    countryCode?: string 
};

/**
 * Registra un nuevo usuario: 1. Firebase Auth, 2. Perfil en Firestore.
 * @returns {Promise<FirebaseAuthUser>} El objeto de usuario de Firebase Auth.
 */
// ✅ CORRECCIÓN TS2353: Cambiamos el argumento 'correo' a 'email'
export const register = async ({ nombre, email, password, countryCode }: RegisterData): Promise<FirebaseAuthUser> => {
    try {
        // 1. CREAR LA CUENTA EN FIREBASE AUTH
        // ✅ Usamos 'email'
        const userCredential = await createUserWithEmailAndPassword(auth, email, password); 
        const firebaseUser = userCredential.user;

        // Opcional: Establecer el nombre de visualización en Firebase Auth
        await updateProfile(firebaseUser, { displayName: nombre });

        // 2. CREAR EL PERFIL DETALLADO EN FIRESTORE
        // ✅ CORRECCIÓN TS2353: Omitimos 'id' y 'uid' (ya que uid es el ID del documento)
        const userProfile: Omit<Usuario, "id" | "uid"> = {
            nombre: nombre,
            // ✅ CORRECCIÓN TS2353: Cambiamos la propiedad 'correo' a 'email'
            email: email, 
            role: 'user', // Asignar rol por defecto para infoUrbi
            countryCode: countryCode || 'VE', // Usamos el código de país o un valor por defecto
            
            // Usamos serverTimestamp() para el tipo correcto de Firestore
            createdAt: serverTimestamp() as FieldValue, 
        };
        
        // Llamamos a la función genérica de Firestore (setDocumentById) para guardar el perfil
        await setDocumentById(usuariosCollection, firebaseUser.uid, userProfile);
        
        return firebaseUser; // Retornamos el objeto Auth User
    } catch (error) {
        console.error("Error en el registro:", error);
        throw error; // Propagar el error para que el AuthProvider lo maneje
    }
};

/**
 * Inicia sesión de un usuario y devuelve el objeto de usuario de Auth.
 */
export const login = async (email: string, password: string): Promise<FirebaseAuthUser> => {
    // Ya usa 'email', no necesita cambios.
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
};

/**
 * Cierra la sesión del usuario.
 */
export const logout = async (): Promise<void> => {
    await signOut(auth);
};