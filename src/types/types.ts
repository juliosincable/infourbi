import { DocumentData, DocumentSnapshot } from 'firebase/firestore';

export interface Usuario {
  id?: string;
  nombre: string;
  correo: string;
}

export interface Negocio {
  id?: string;
  nombre: string;
  propietario_id: string; // Se mantiene por si se necesita saber el propietario
  whatsapp: string;
  instagram?: string;
  direccion: string;
  tiktok?: string;
  web?: string;
  coordenadas: {
    lat: number;
    lng: number;
  };
  foto: string; // URL de la foto principal
  codigoQr: string; // URL del código QR
  administradores: string[];
  logo: string; // URL del logo
  categoria: string;
  lugar: string[]; // <-- Campo 'lugar' como un array de strings
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
  pais_id: string; // Referencia al ID del país
}

export interface Ciudad {
  id?: string;
  nombre: string;
  estado_id: string; // Referencia al ID del estado
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
  pageSize: number;
  startAfterDoc?: DocumentSnapshot<DocumentData>;
  orderByField?: string;
  orderDirection?: 'asc' | 'desc';
}