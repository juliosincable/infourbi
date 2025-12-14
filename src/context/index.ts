// src/context/index.ts
// Este es el punto de entrada que soluciona todos los errores TS2305 en App.tsx y Register.tsx.

// 1. Importamos la Constante, el Tipo y el hook useAuth desde el archivo de tipos:
import { AuthContext, useAuth } from './authContextTypes'; 
import type { AuthContextType } from './authContextTypes'; 

// 2. Importamos y re-exportamos solo el Provider desde Auth.tsx:
export { AuthProvider } from './Auth'; 

// 3. Re-exportamos todo (Context, Hook y Type) para fácil acceso:
export { AuthContext, useAuth };
export type { AuthContextType };