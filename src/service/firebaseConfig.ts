// Importamos las funciones necesarias para la inicialización y la corrección del bug.
import { initializeApp, getApps, getApp } from "firebase/app"; 
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // Servicio de Base de Datos
import { getAuth } from "firebase/auth";           // Servicio de Autenticación
import { getStorage } from "firebase/storage";     // Servicio de Almacenamiento

// 1. Usamos import.meta.env.* para leer tus claves desde tu archivo .env
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
};

// 2. CORRECCIÓN CRÍTICA: Inicializa Firebase ÚNICAMENTE si no existe una instancia.
// ESTO ELIMINA EL ERROR FATAL DE DUPLICACIÓN (app/duplicate-app).
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Inicializa y exporta las instancias de los servicios
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app); 
const analytics = getAnalytics(app);

export default app;