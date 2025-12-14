// src/context/authService.ts

import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    updateProfile, 
    User as FirebaseAuthUser,
} from "firebase/auth";

// ✅ CORRECCIÓN TS2322: Importamos serverTimestamp y FieldValue de firestore
import { serverTimestamp, FieldValue } from "firebase/firestore"; 

// ✅ CORRECCIÓN TS2307 (Ruta): Importamos la instancia de auth desde service
import { auth } from "../service/firebaseConfig";

// ✅ CORRECCIÓN TS2459: Importamos los TIPOS directamente desde la fuente original
import { Usuario } from "../types/types"; 

// Importamos las funciones y colecciones de Firestore desde tu capa de datos
// ✅ CORRECCIÓN TS2307 (Ruta): setDocumentById y usuariosCollection vienen de ../service/database
import { setDocumentById, usuariosCollection } from "../service/database"; 


// --- TIPOS LOCALES PARA EL SERVICIO ---
type RegisterData = { 
    nombre: string; 
    correo: string; 
    password: string; 
    countryCode?: string 
};

/**
 * Registra un nuevo usuario: 1. Firebase Auth, 2. Perfil en Firestore.
 * @returns {Promise<FirebaseAuthUser>} El objeto de usuario de Firebase Auth.
 */
export const register = async ({ nombre, correo, password, countryCode }: RegisterData): Promise<FirebaseAuthUser> => {
    try {
        // 1. CREAR LA CUENTA EN FIREBASE AUTH
        const userCredential = await createUserWithEmailAndPassword(auth, correo, password);
        const firebaseUser = userCredential.user;

        // Opcional: Establecer el nombre de visualización en Firebase Auth
        await updateProfile(firebaseUser, { displayName: nombre });

        // 2. CREAR EL PERFIL DETALLADO EN FIRESTORE
        // Usamos el UID de Firebase Auth como ID del documento en Firestore
        const userProfile: Omit<Usuario, "id"> = {
            nombre: nombre,
            correo: correo,
            role: 'user', // Asignar rol por defecto para infoUrbi
            countryCode: countryCode || 'VE', // Usamos el código de país o un valor por defecto
            
            // ✅ CORRECCIÓN TS2322: Usamos serverTimestamp() para el tipo correcto de Firestore
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
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
};

/**
 * Cierra la sesión del usuario.
 */
export const logout = async (): Promise<void> => {
    await signOut(auth);
};