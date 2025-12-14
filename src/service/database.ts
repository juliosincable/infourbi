import { db } from "../service/firebaseConfig";
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
    DocumentSnapshot,
    WhereFilterOp, 
    setDoc, 
    serverTimestamp, 
} from "firebase/firestore";

import {
    Usuario,
    Negocio,
    Lugar,
    Evento,
    Producto,
    Pais,
    Estado,
    Ciudad,
    PaginationOptions,
} from "../types/types";

// --- TIPOS ADICIONALES PARA LA CONSULTA GENÉRICA ---
export type WhereClause = {
    field: string;
    operator: WhereFilterOp;
    value: unknown;
};

// --- CONVERSOR DE DATOS GENÉRICO ---
/**
 * Crea un conversor de Firestore para manejar la tipificación fuerte.
 * Convierte Timestamps a Date y añade el ID del documento a los datos.
 */
const createConverter = <
    T extends { id?: string }
>(): FirestoreDataConverter<T> => ({
    toFirestore: (data: WithFieldValue<T>): DocumentData => {
        const { id: _id, ...rest } = data;
        return rest;
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot): T => {
        const data = snapshot.data();
        for (const key in data) {
            if (data[key]?.toDate && typeof data[key].toDate === "function") {
                // Conversión de Firebase Timestamp a JavaScript Date
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
export const usuariosCollection = collection(db, "usuarios").withConverter(
    createConverter<Usuario>()
);
export const negociosCollection = collection(db, "negocios").withConverter(
    createConverter<Negocio>()
);
export const lugaresCollection = collection(db, "lugares").withConverter(
    createConverter<Lugar>()
);
export const eventosCollection = collection(db, "eventos").withConverter(
    createConverter<Evento>()
);
export const productosCollection = collection(db, "productos").withConverter(
    createConverter<Producto>()
);
export const paisesCollection = collection(db, "paises").withConverter(
    createConverter<Pais>()
);
export const estadosCollection = collection(db, "estados").withConverter(
    createConverter<Estado>()
);
export const ciudadesCollection = collection(db, "ciudades").withConverter(
    createConverter<Ciudad>()
);

// --- OPERACIONES CRUD GENÉRICAS ---

/**
 * Función genérica para obtener documentos con filtros WHERE y opciones de paginación.
 */
export const queryDocuments = async <T extends { id?: string }>(
    collectionRef: CollectionReference<T>,
    whereClauses: WhereClause[] = [],
    pagination?: PaginationOptions
): Promise<{
    data: T[];
    lastVisible: DocumentSnapshot<DocumentData> | null;
}> => {
    try {
        let q: Query<T> = query(collectionRef);

        // 1. Aplicar filtros WHERE
        whereClauses.forEach((clause) => {
            q = query(q, where(clause.field, clause.operator, clause.value));
        });

        // 2. Aplicar opciones de paginación
        if (pagination) {
            if (pagination.orderByField) {
                q = query(
                    q,
                    orderBy(pagination.orderByField, pagination.orderDirection || "asc")
                );
            }
            if (pagination.pageSize) {
                q = query(q, limit(pagination.pageSize));
            }
            if (pagination.startAfterDoc) {
                q = query(q, startAfter(pagination.startAfterDoc));
            }
        }

        const querySnapshot = await getDocs(q);
        const lastVisible =
            querySnapshot.docs.length > 0
                ? querySnapshot.docs[querySnapshot.docs.length - 1]
                : null;
        const data = querySnapshot.docs.map((doc) => doc.data());

        return { data, lastVisible };
    } catch (error) {
        console.error("Error al ejecutar la consulta con filtros:", error);
        throw new Error(`Error al ejecutar la consulta con filtros: ${error instanceof Error ? error.message : String(error)}`);
    }
};

/**
 * Función que obtiene todos los documentos de una colección (ahora usa queryDocuments sin filtros).
 */
export const getDocuments = async <T extends { id?: string }>(
    collectionRef: CollectionReference<T>,
    pagination?: PaginationOptions
): Promise<{
    data: T[];
    lastVisible: DocumentSnapshot<DocumentData> | null;
}> => {
    return queryDocuments(collectionRef, [], pagination);
};

// ✅ FUNCIÓN REQUERIDA POR Auth.tsx: Obtener un documento por ID
export const getDocumentById = async <T extends { id?: string }>(
    collectionRef: CollectionReference<T>,
    id: string
): Promise<T | null> => {
    try {
        const docRef = doc(collectionRef, id);
        const docSnap = await getDoc(docRef);
        // Gracias al conversor, docSnap.data() ya incluye el ID y los tipos correctos
        return docSnap.exists() ? docSnap.data() : null; 
    } catch (error) {
        console.error(`Error al obtener el documento con ID '${id}':`, error);
        throw new Error(`Error al obtener el documento con ID '${id}': ${error instanceof Error ? error.message : String(error)}`);
    }
};

export const addDocument = async <T extends { id?: string }>(
    collectionRef: CollectionReference<T>,
    data: Omit<T, "id">
): Promise<string> => {
    try {
        const docRef = await addDoc(
            collectionRef as CollectionReference<Omit<T, "id">>,
            data
        );
        return docRef.id;
    } catch (error) {
        console.error("Error al agregar un nuevo documento:", error);
        throw new Error(`Error al agregar un nuevo documento: ${error instanceof Error ? error.message : String(error)}`);
    }
};

export const updateDocument = async <T extends { id?: string }>(
    collectionRef: CollectionReference<T>,
    id: string,
    data: Partial<Omit<T, "id">>
): Promise<void> => {
    try {
        const docRef = doc(collectionRef, id);
        await updateDoc(docRef, data as DocumentData);
    } catch (error) {
        console.error(`Error al actualizar el documento con ID '${id}':`, error);
        throw new Error(`Error al actualizar el documento con ID '${id}': ${error instanceof Error ? error.message : String(error)}`);
    }
};

export const deleteDocument = async <T extends { id?: string }>(
    collectionRef: CollectionReference<T>,
    id: string
): Promise<void> => {
    try {
        await deleteDoc(doc(collectionRef, id));
    } catch (error) {
        console.error(`Error al eliminar el documento con ID '${id}':`, error);
        throw new Error(`Error al eliminar el documento con ID '${id}': ${error instanceof Error ? error.message : String(error)}`);
    }
};

// FUNCIÓN DE VINCULACIÓN: setDocumentById 
/**
 * Función genérica para CREAR (o actualizar) un documento 
 * utilizando un ID externo (ej: el UID de Firebase Auth). Usa setDoc.
 */
export const setDocumentById = async <T extends { id?: string }>(
    collectionRef: CollectionReference<T>,
    id: string,
    data: Omit<T, "id"> | Partial<Omit<T, "id">>
): Promise<void> => {
    try {
        const docRef = doc(collectionRef, id);
        // Usamos { merge: true } para crear/actualizar
        await setDoc(docRef, data as DocumentData, { merge: true });
    } catch (error) {
        console.error(`Error al establecer el documento con ID '${id}':`, error);
        throw new Error(`Error al establecer el documento con ID '${id}': ${error instanceof Error ? error.message : String(error)}`);
    }
};


// --- FUNCIONES ESPECÍFICAS POR ENTIDAD (REFFACTORIZADAS) ---

export const addUser = (data: Omit<Usuario, "id">) =>
    addDocument(usuariosCollection, data);

// ✅ FUNCIÓN AÑADIDA PARA CUMPLIR EL CONTRATO DE Auth.tsx
/**
 * Obtiene el perfil de un usuario de infoUrbi por su UID de Firebase Auth.
 * Utiliza la función genérica getDocumentById.
 */
export const getUserProfile = (uid: string): Promise<Usuario | null> => {
    return getDocumentById<Usuario>(usuariosCollection, uid);
};

/**
 * Simplificado usando la función genérica queryDocuments.
 */
export const getUserByEmail = async (email: string) => {
    const result = await queryDocuments(usuariosCollection, [
        { field: "correo", operator: "==", value: email },
    ]);
    if (result.data.length > 1) {
        console.warn(`Se encontraron varios usuarios con el mismo correo electrónico: ${email}`);
    }
    // La consulta de un solo documento devuelve un array, tomamos el primero.
    return result.data[0] || null;
};

export const addNegocio = (data: Omit<Negocio, "id">) =>
    addDocument(negociosCollection, data);

/**
 * Simplificado usando la función genérica queryDocuments.
 */
export const getNegociosByPropietario = async (propietarioId: string) => {
    const result = await queryDocuments(negociosCollection, [
        { field: "propietario_id", operator: "==", value: propietarioId },
    ]);
    return result.data;
};

export const addLugar = (data: Omit<Lugar, "id">) =>
    addDocument(lugaresCollection, data);

/**
 * Simplificado usando la función genérica queryDocuments.
 */
export const getLugaresByNegocio = async (negocioId: string) => {
    const result = await queryDocuments(lugaresCollection, [
        { field: "negocio_id", operator: "==", value: negocioId },
    ]);
    return result.data;
};

export const addEvento = (data: Omit<Evento, "id">) =>
    addDocument(eventosCollection, data);

/**
 * Simplificado usando la función genérica queryDocuments.
 */
export const getEventosByLugar = async (lugarId: string) => {
    const result = await queryDocuments(
        eventosCollection,
        [
            { field: "lugar_id", operator: "==", value: lugarId },
        ],
        {
            // Se mantiene el ordenamiento específico de la entidad
            orderByField: "fecha",
            orderDirection: "asc",
        }
    );
    return result.data;
};

export const addProducto = (data: Omit<Producto, "id">) =>
    addDocument(productosCollection, data);

/**
 * Simplificado usando la función genérica queryDocuments.
 */
export const getProductosByNegocio = async (negocioId: string) => {
    const result = await queryDocuments(
        productosCollection,
        [
            { field: "negocio_id", operator: "==", value: negocioId },
        ],
        {
            // Se mantiene el ordenamiento específico de la entidad
            orderByField: "nombre",
            orderDirection: "asc",
        }
    );
    return result.data;
};