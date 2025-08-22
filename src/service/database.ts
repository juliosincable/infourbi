// Importa las funciones necesarias de Firebase y Firestore
import { db } from "./firebaseConfig"; // Asegúrate de que esta ruta sea correcta
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  DocumentData,
  FirestoreDataConverter,
  WithFieldValue,
  CollectionReference,
  Query,
  QueryDocumentSnapshot,
  DocumentSnapshot
} from "firebase/firestore";

// --- INTERFACES DE DATOS (Tipos) ---
export interface Usuario {
  id?: string;
  nombre: string;
  correo: string;
}

export interface Negocio {
  id?: string;
  nombre: string;
  propietario_id: string;
}

export interface Lugar {
  id?: string;
  nombre: string;
  negocio_id: string;
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

// --- TIPO PARA OPCIONES DE PAGINACIÓN ---
export interface PaginationOptions {
  pageSize: number;
  startAfterDoc?: DocumentSnapshot<DocumentData>;
  orderByField?: string;
  orderDirection?: 'asc' | 'desc';
}

// --- CONVERSOR DE DATOS GENÉRICO ---
const createConverter = <T extends { id?: string }>(): FirestoreDataConverter<T> => ({
  toFirestore: (data: WithFieldValue<T>): DocumentData => {
    const { id, ...rest } = data;
    return rest;
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot): T => {
    const data = snapshot.data();
    for (const key in data) {
      if (data[key]?.toDate && typeof data[key].toDate === 'function') {
        data[key] = data[key].toDate();
      }
    }
    return {
      ...data,
      id: snapshot.id,
    } as T;
  },
});


// --- REFERENCIAS A COLECCIONES CON TIPADO FUERTE ---
const usuariosCollection = collection(db, "usuarios").withConverter(createConverter<Usuario>());
const negociosCollection = collection(db, "negocios").withConverter(createConverter<Negocio>());
const lugaresCollection = collection(db, "lugares").withConverter(createConverter<Lugar>());
const eventosCollection = collection(db, "eventos").withConverter(createConverter<Evento>());
const productosCollection = collection(db, "productos").withConverter(createConverter<Producto>());

// --- OPERACIONES CRUD GENÉRICAS ---

/**
 * Obtiene documentos de una colección una sola vez, con opción de paginación.
 * @param collectionRef Referencia a la colección.
 * @param pagination Opciones para paginar y ordenar.
 * @returns Un objeto con los datos y el último documento para la siguiente página.
 */
export const getDocuments = async <T extends { id?: string }>(
  collectionRef: CollectionReference<T>,
  pagination?: PaginationOptions
): Promise<{ data: T[]; lastVisible: DocumentSnapshot<DocumentData> | null }> => {
  try {
    let q: Query<T> = query(collectionRef);

    if (pagination) {
      if (pagination.orderByField) {
        q = query(q, orderBy(pagination.orderByField, pagination.orderDirection || 'asc'));
      }
      if (pagination.pageSize) {
        q = query(q, limit(pagination.pageSize));
      }
      if (pagination.startAfterDoc) {
        q = query(q, startAfter(pagination.startAfterDoc));
      }
    }

    const querySnapshot = await getDocs(q);
    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1] || null;
    const data = querySnapshot.docs.map(doc => doc.data());

    return { data, lastVisible };
  } catch (error) {
    console.error("Error al obtener documentos:", error);
    throw new Error("No se pudieron obtener los documentos.");
  }
};

/**
 * Obtiene un documento por su ID.
 * @param collectionRef Referencia a la colección.
 * @param id ID del documento.
 * @returns El documento o null si no existe.
 */
export const getDocumentById = async <T extends { id?: string }>(
  collectionRef: CollectionReference<T>,
  id: string
): Promise<T | null> => {
  try {
    const docRef = doc(collectionRef, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error(`Error al obtener el documento con ID '${id}':`, error);
    throw new Error("No se pudo obtener el documento.");
  }
};

/**
 * Agrega un nuevo documento a una colección.
 * @param collectionRef Referencia a la colección.
 * @param data Datos del nuevo documento.
 * @returns El ID del nuevo documento.
 */
export const addDocument = async <T extends { id?: string }>(
  collectionRef: CollectionReference<T>,
  data: Omit<T, 'id'>
): Promise<string> => {
  try {
    const docRef = await addDoc(collectionRef, data as T);
    return docRef.id;
  } catch (error) {
    console.error("Error al agregar un nuevo documento:", error);
    throw new Error("No se pudo agregar el documento.");
  }
};

/**
 * Actualiza un documento existente.
 * @param collectionRef Referencia a la colección.
 * @param id ID del documento a actualizar.
 * @param data Datos a actualizar.
 */
export const updateDocument = async <T extends { id?: string }>(
  collectionRef: CollectionReference<T>,
  id: string,
  data: Partial<Omit<T, 'id'>>
): Promise<void> => {
  try {
    const docRef = doc(collectionRef, id);
    await updateDoc(docRef, data as DocumentData);
  } catch (error) {
    console.error(`Error al actualizar el documento con ID '${id}':`, error);
    throw new Error("No se pudo actualizar el documento.");
  }
};

/**
 * Elimina un documento por su ID.
 * @param collectionRef Referencia a la colección.
 * @param id ID del documento a eliminar.
 */
export const deleteDocument = async <T extends { id?: string }>(
  collectionRef: CollectionReference<T>,
  id: string
): Promise<void> => {
  try {
    await deleteDoc(doc(collectionRef, id));
  } catch (error) {
    console.error(`Error al eliminar el documento con ID '${id}':`, error);
    throw new Error("No se pudo eliminar el documento.");
  }
};

// --- FUNCIONES ESPECÍFICAS POR ENTIDAD ---
// Las siguientes funciones utilizan las operaciones genéricas.

// -- Usuarios
export const addUser = (data: Omit<Usuario, 'id'>) => addDocument(usuariosCollection, data);
// Para obtener un usuario por correo, en lugar de un listener, puedes usar getDocs
export const getUserByEmail = async (email: string) => {
  const q = query(usuariosCollection, where("correo", "==", email), limit(1));
  const querySnapshot = await getDocs(q);
  const docSnap = querySnapshot.docs[0];
  return docSnap ? docSnap.data() : null;
};

// -- Negocios
export const addNegocio = (data: Omit<Negocio, 'id'>) => addDocument(negociosCollection, data);
export const getNegociosByPropietario = async (propietarioId: string) => {
  const q = query(negociosCollection, where("propietario_id", "==", propietarioId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data());
};

// -- Lugares
export const addLugar = (data: Omit<Lugar, 'id'>) => addDocument(lugaresCollection, data);
export const getLugaresByNegocio = async (negocioId: string) => {
  const q = query(lugaresCollection, where("negocio_id", "==", negocioId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data());
};

// -- Eventos
export const addEvento = (data: Omit<Evento, 'id'>) => addDocument(eventosCollection, data);
export const getEventosByLugar = async (lugarId: string) => {
  const q = query(eventosCollection, where("lugar_id", "==", lugarId), orderBy("fecha", "asc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data());
};

// -- Productos
export const addProducto = (data: Omit<Producto, 'id'>) => addDocument(productosCollection, data);
export const getProductosByNegocio = async (negocioId: string) => {
  const q = query(productosCollection, where("negocio_id", "==", negocioId), orderBy("nombre", "asc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data());
};

// --- EXPORTACIÓN DE REFERENCIAS Y FUNCIONES ---
export {
  usuariosCollection,
  negociosCollection,
  lugaresCollection,
  eventosCollection,
  productosCollection,
};