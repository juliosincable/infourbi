import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"; // <-- Importación agregada

// La configuración de Firebase utiliza las variables de entorno de Vite.
// Asegúrate de que todas tus variables VITE_ estén definidas en tu archivo .env
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
};

// Inicializa la aplicación principal de Firebase
const app = initializeApp(firebaseConfig);

// Inicializa y exporta las instancias de los servicios
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app); // <-- Inicialización y exportación de Storage

// Opcional: Inicializa Analytics (útil para seguimiento del uso)
export const analytics = getAnalytics(app);

// Exporta la app en caso de que necesites inicializar otros servicios o usarla directamente
export default app;
