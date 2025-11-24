// Archivo: src/router/InitialRedirector.tsx

import React from "react"; 
import { Redirect } from "react-router-dom";
// ❌ ANTES: import { useAuth } from "../context/Auth"; 
// ✅ CORRECCIÓN: Apuntamos al nuevo archivo de definiciones donde reside useAuth.
import { useAuth } from "../context/AuthDefinitions"; 
import { IonLoading } from "@ionic/react";

// Define las rutas
const AUTHENTICATED_PATH = "/home";
const UNAUTHENTICATED_PATH = "/login"; 

/**
 * Componente que se utiliza para la ruta raíz ("/") y redirige
 * basado en el estado de autenticación del usuario.
 */
const InitialRedirector: React.FC = () => {
  // Usamos el hook useAuth() para obtener las propiedades
  const { isAuthenticated, loading } = useAuth(); 

  // Muestra un spinner mientras se verifica el estado de autenticación
  if (loading) {
    return <IonLoading isOpen={true} message={"Verificando sesión..."} />;
  }

  // Si está autenticado, redirige a la página principal
  if (isAuthenticated) {
    return <Redirect to={AUTHENTICATED_PATH} />;
  }

  // Si NO está autenticado, redirige a la página de bienvenida/login
  return <Redirect to={UNAUTHENTICATED_PATH} />;
};

export default InitialRedirector;