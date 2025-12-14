import { DocumentData, DocumentSnapshot, FieldValue, Timestamp } from 'firebase/firestore';

// =========================================================
// INTERFAZ USUARIO (CORREGIDA Y COMPLETA)
// =========================================================
export interface Usuario {
  id?: string;
  nombre: string;
  correo: string;
  
  // CAMPOS CLAVE AÑADIDOS PARA EL PROYECTO infoUrbi
  role: 'user' | 'business_owner' | 'institution_owner' | 'admin';
  countryCode: string; 
  createdAt: FieldValue | Timestamp; // <== ESTO FUE LA CORRECCIÓN CLAVE
}

// =========================================================
// OTRAS INTERFACES
// =========================================================

export interface Negocio {
  id?: string;
  nombre: string;
  propietario_id: string; 
  whatsapp: string;
  instagram?: string;
  direccion: string;
  tiktok?: string;
  web?: string;
  coordenadas: {
    lat: number;
    lng: number;
  };
  foto: string; 
  codigoQr: string; 
  administradores: string[];
  logo: string; 
  categoria: string;
  lugar: string[]; 
}

export interface Lugar {
  id?: string;
  nombre: string;
  negocio_id: string;
}

export interface Pais {
  id?: string;
  nombre: string;
}

export interface Estado {
  id?: string;
  nombre: string;
  pais_id: string; 
}

export interface Ciudad {
  id?: string;
  nombre: string;
  estado_id: string; 
}

export interface Evento {
  id?: string;
  nombre: string;
  lugar_id: string;
  fecha: Date;
}

export interface Producto {
  id?: string;
  nombre: string;
  negocio_id: string;
  precio: number;
}

export interface PaginationOptions {
  pageSize?: number;
  startAfterDoc?: DocumentSnapshot<DocumentData>;
  orderByField?: string;
  orderDirection?: 'asc' | 'desc';
}