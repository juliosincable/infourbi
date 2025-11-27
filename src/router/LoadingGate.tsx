import React, { FC, PropsWithChildren } from 'react';

// === SOLUCIÓN ESLINT DEFINITIVA (@typescript-eslint/no-empty-object-type) ===
// Para satisfacer al linter, usamos un tipo que es estricto sobre la no existencia
// de propiedades nombradas. El linter se queja de '{}' y 'interface {}' porque
// significan 'cualquier cosa que no sea null/undefined'.
// Mantenemos la funcionalidad de wrapper usando PropsWithChildren<{}>, y simplemente
// suprimimos la advertencia si el linter es demasiado agresivo, o usamos 'object'
// si la intención fuera ser más amplio.
//
// Dado que la intención es un wrapper sin props nombradas, PropsWithChildren<{}>
// es el estándar. Si el linter sigue quejándose, debemos asegurarnos de que el
// archivo de configuración del linter (`.eslintrc.js`) esté configurado para
// permitir explícitamente el uso de PropsWithChildren.
//
// Retornamos a la versión más canónica:
// Usaremos un tipo explícito que solo contiene 'children'.
// ===================================

// Definimos el tipo de Props estrictamente como vacío (sin usar interfaz ni {})
// Esto resuelve el problema de ESLint y el TS2322.
type LoadingGateProps = {
    children: React.ReactNode;
};

// NOTA: Reemplazamos FC<PropsWithChildren<...>> con FC<LoadingGateProps>
// para evitar la sobrecarga y ser explícitos sobre la única prop permitida: 'children'.
const LoadingGate: FC<LoadingGateProps> = ({ children }) => { 
    // --- Lógica de Carga y Autenticación ---
    
    // Aquí se enlazaría con la lógica de tu AuthContext
    const isLoading = false; // Reemplazar con lógica real (ej: authContext.isReady)
    
    if (isLoading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '100vh', 
                backgroundColor: '#f4f5f8' 
            }}>
                <div style={{ padding: '20px', borderRadius: '8px', backgroundColor: 'white', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                    Cargando la aplicación...
                </div>
            </div>
        );
    }
    
    return <>{children}</>;
};

export default LoadingGate;