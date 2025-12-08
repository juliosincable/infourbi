// Archivo: src/service/firebaseConfig.ts (VERSIÓN CORREGIDA FINAL)

// Importaciones de las funciones del SDK de Firebase
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore'; // <-- CORRECCIÓN: Importar getFirestore
import { getAuth, Auth } from 'firebase/auth';

// --- CONFIGURACIÓN PARA VITE ---
// Usamos import.meta.env para acceder a las variables de entorno en el navegador.
const firebaseConfig = {
    // Las claves deben coincidir con el prefijo VITE_ de tu .env
    apiKey: import.meta.env.VITE_API_KEY, 
    authDomain: import.meta.env.VITE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_ID,
    measurementId: import.meta.env.VITE_MEASUREMENT_ID, 
};

// 1. Inicializar Firebase
export const app: FirebaseApp = initializeApp(firebaseConfig);

// 2. Inicializar servicios y exportarlos (CORRECCIÓN: Se eliminó la importación incorrecta de la línea 2)
export const db: Firestore = getFirestore(app); // <-- Función getFirestore ahora disponible
export const auth: Auth = getAuth(app);

// Exportación por defecto opcional
// export default app;