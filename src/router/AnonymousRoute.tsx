// Archivo: src/router/AnonymousRoute.tsx (FINALMENTE CORREGIDO y limpio)

import React from 'react';
// Importaciones de React Router v5
import { Route, Redirect, RouteProps, RouteComponentProps } from 'react-router-dom'; 

// ✅ CORRECCIÓN TS2305: Apuntamos a la nueva ubicación del hook después del refactoring.
import { useAuth } from '../context/AuthDefinitions'; 

import { IonSpinner } from '@ionic/react';

// Tipamos los props de ruta de v5 para eliminar errores TS2559 y ESLint.
// Usamos 'object' para evitar el warning '@typescript-eslint/no-empty-object-type'.
type AnonymousRouteComponentProps = RouteComponentProps<object>;

// Definimos los props que acepta AnonymousRoute.
interface AnonymousRouteProps extends RouteProps {
  component: React.ComponentType<AnonymousRouteComponentProps>; 
}

export const AnonymousRoute: React.FC<AnonymousRouteProps> = ({ component: Component, ...rest }) => {
  const { isAuthenticated, loading } = useAuth();

  return (
    <Route
      {...rest}
      render={(props: AnonymousRouteComponentProps) => { 
        
        if (loading) {
          // Muestra el Spinner de carga
          return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
              <IonSpinner name="crescent" />
            </div>
          );
        }

        if (isAuthenticated) {
          // Si está autenticado, redirige a la ruta principal.
          return <Redirect to="/home" />; 
        } else {
          // Si no está autenticado, permite el acceso (ej: Login/Registro).
          return <Component {...props} />;
        }
      }}
    />
  );
};