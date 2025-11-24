import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// --- CONFIGURACIÓN CORREGIDA PARA VITE ---
// Usamos import.meta.env para acceder a las variables de entorno en el navegador.
const firebaseConfig = {
  // Las claves deben coincidir con el prefijo VITE_ de tu .env
  apiKey: import.meta.env.VITE_API_KEY, 
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  // measurementId es opcional, pero lo incluimos si lo tienes:
  measurementId: import.meta.env.VITE_MEASUREMENT_ID, 
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar servicios y exportarlos para usarlos en el resto de la app
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;