// Archivo: src/router/PrivateRoute.tsx

import React from 'react';
// Importamos los tipos necesarios de React Router v5.
import { Route, Redirect, RouteProps, RouteComponentProps } from 'react-router-dom'; 

// ❌ CORRECCIÓN #1: Apuntamos al nuevo archivo de definiciones (AuthDefinitions.ts)
import { useAuth } from '../context/AuthDefinitions'; 
import { IonSpinner } from '@ionic/react';

// ❌ CORRECCIÓN #2 y #3: Tipamos los props de ruta de v5 correctamente.
// Usamos 'object' para los parámetros de ruta, resolviendo TS2559 y el warning de ESLint.
type PrivateRouteComponentProps = RouteComponentProps<object>;

// Definimos los props que acepta PrivateRoute.
interface PrivateRouteProps extends RouteProps {
  // Ahora el componente acepta los props de la ruta de v5.
  component: React.ComponentType<PrivateRouteComponentProps>; 
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component, ...rest }) => {
  const { isAuthenticated, loading } = useAuth();

  // Se pasa la referencia a RouteProps como 'rest'
  return (
    <Route
      {...rest}
      // Tipamos el argumento 'props' en el render para asegurar la compatibilidad.
      render={(props: PrivateRouteComponentProps) => { // 👈 Usamos el prop 'render'
        
        if (loading) {
          // Muestra el Spinner de carga
          return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
              <IonSpinner name="crescent" />
            </div>
          );
        }

        if (isAuthenticated) {
          // Si está autenticado, renderiza el Componente con sus props
          return <Component {...props} />;
        } else {
          // Si NO está autenticado, redirige al login, pasando la ubicación actual
          return (
            <Redirect 
              to={{
                pathname: "/login",
                // Pasamos la ubicación actual para redirigir al usuario después del login.
                state: { from: props.location }
              }}
            />
          );
        }
      }}
    />
  );
};