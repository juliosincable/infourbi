// Archivo: src/service/firebaseConfig.ts (CON PERSISTENCIA ACTIVA)

import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore'; 
import { getAuth, Auth, setPersistence, browserLocalPersistence } from 'firebase/auth'; // <-- Añade estas importaciones

const firebaseConfig = {
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

// 2. Inicializar servicios
export const db: Firestore = getFirestore(app);
export const auth: Auth = getAuth(app);

// 3. Configurar persistencia explícita (ESTO ARREGLA EL RETRASO AL RECARGAR)
setPersistence(auth, browserLocalPersistence)
  .catch((error) => {
    console.error("Error en persistencia Firebase:", error);
  });