// Archivo: src/router/LoadingGate.tsx (VERSIÓN CORREGIDA)

import React, { FC } from 'react';
import { IonSpinner } from '@ionic/react'; // Importamos el spinner de Ionic


// Ahora apunta al archivo que acabamos de confirmar que EXPORTA useAuth
import { useAuth } from '../context/AuthDefinitions';

// Definimos el tipo de Props estrictamente como vacío (sin usar interfaz ni {})
type LoadingGateProps = {
    children: React.ReactNode;
};

// NOTA: LoadingGate debe ENVOLVER a AuthProvider en App.tsx, 
// o usarse dentro de él si solo queremos bloquear la UI. 
// Asumiremos que estás bloqueando el renderizado de la UI principal *antes*
// de que el AuthProvider se inicialice completamente.

const LoadingGate: FC<LoadingGateProps> = ({ children }) => { 
    
    // 🛑 CORRECCIÓN: Usar la lógica de carga del contexto de autenticación.
    // Asumimos que useAuth.loading es true mientras Firebase se inicializa.
    const { loading } = useAuth();
    
    if (loading) { // 🛑 Ahora usa el estado real
        return (
            // Usamos un contenedor centrado para la pantalla de carga inicial
            <div 
                style={{ 
                    display: 'flex', 
                    flexDirection: 'column', // Centrar verticalmente también
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    minHeight: '100vh', 
                    backgroundColor: 'var(--ion-color-light)' // Fondo claro de Ionic
                }}
            >
                <IonSpinner name="dots" color="primary" style={{ transform: 'scale(1.5)' }} />
                <p style={{ marginTop: '20px', color: 'var(--ion-color-medium)' }}>Cargando la aplicación...</p>
            </div>
        );
    }
    
    // Una vez que loading es false (el estado de Auth es conocido), renderizamos la aplicación
    return <>{children}</>;
};

export default LoadingGate;