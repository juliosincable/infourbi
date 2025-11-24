// Archivo: ./src/context/index.ts (CORREGIDO FINAL)
// Este archivo actúa como el catálogo (barrel file) para exportar el hook y los tipos.

import { useContext } from 'react';

// Importamos los valores necesarios para uso interno.
import { AuthContext } from './Auth'; 
// Importamos el tipo para su re-exportación.
import type { AuthContextType } from './Auth'; 
// Importamos y re-exportamos el Proveedor, ya que el componente principal (App.tsx) 
// necesitará envolverse en él.
export { AuthProvider } from './Auth'; 

/**
 * Hook para consumir el contexto de autenticación.
 * Se exporta desde aquí para que Auth.tsx pueda cumplir con las reglas de Fast Refresh.
 */
export const useAuth = () => {
    // Este hook ahora funciona porque AuthContext está correctamente re-exportado en Auth.tsx
    return useContext(AuthContext);
};

// Re-exportamos el tipo (ya importado arriba).
export type { AuthContextType };