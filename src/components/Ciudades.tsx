import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styles from './Ciudades.module.scss';

// --- Dependencias de Firebase ---
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, collection, addDoc, onSnapshot, query } from 'firebase/firestore';

// --- Definiciones de Tipos de Datos ---
interface Pais {
    id: string;
    nombre: string;
}

interface Estado {
    id: string;
    nombre: string;
    pais_id: string; // Enlace al País
}

interface Ciudad {
    id: string;
    nombre: string;
    estado_id: string; // Enlace al Estado
    pais_id: string; // Para facilitar consultas y desnormalización
}

type LocationType = 'pais' | 'estado' | 'ciudad';

// --- Constantes y Configuración de Firebase ---
// Estas variables se asumen disponibles en el entorno de ejecución
declare const __app_id: string;
declare const __firebase_config: string;
declare const __initial_auth_token: string;

const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {}; 

// Inicialización de Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const CREATE_NEW_OPTION = 'CREATE_NEW';
const LS_KEY_SELECTED_ID = 'firebase_selected_ciudad_id'; 

// --- Custom Hook para Lógica de Firestore y Estado Centralizado ---

const useLocationData = (userId: string | null) => {
    const [paises, setPaises] = useState<Pais[]>([]);
    const [estados, setEstados] = useState<Estado[]>([]);
    const [ciudades, setCiudades] = useState<Ciudad[]>([]);
    const [loading, setLoading] = useState(true);

    const getLocationCollectionPath = (type: LocationType) => {
        if (!userId) return '';
        let collectionName;
        switch (type) {
            case 'pais': collectionName = 'paises'; break;
            case 'estado': collectionName = 'estados'; break;
            case 'ciudad': collectionName = 'ciudades'; break;
        }
        // Ruta de colección privada por usuario, por aplicación
        return `artifacts/${appId}/users/${userId}/${collectionName}`;
    };

    // Manejar Suscripciones a Datos (onSnapshot)
    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        const cleanupFunctions: (() => void)[] = [];

        // Suscripción para Países
        const qPaises = query(collection(db, getLocationCollectionPath('pais')));
        cleanupFunctions.push(onSnapshot(qPaises, (snapshot) => {
            const data: Pais[] = snapshot.docs.map(doc => ({ id: doc.id, nombre: doc.data().nombre }));
            setPaises(data);
            setLoading(false);
        }));

        // Suscripción para Estados
        const qEstados = query(collection(db, getLocationCollectionPath('estado')));
        cleanupFunctions.push(onSnapshot(qEstados, (snapshot) => {
            const data: Estado[] = snapshot.docs.map(doc => ({ 
                id: doc.id, 
                nombre: doc.data().nombre,
                pais_id: doc.data().pais_id,
            }));
            setEstados(data);
        }));

        // Suscripción para Ciudades
        const qCiudades = query(collection(db, getLocationCollectionPath('ciudad')));
        cleanupFunctions.push(onSnapshot(qCiudades, (snapshot) => {
            const data: Ciudad[] = snapshot.docs.map(doc => ({ 
                id: doc.id, 
                nombre: doc.data().nombre,
                estado_id: doc.data().estado_id,
                pais_id: doc.data().pais_id,
            }));
            setCiudades(data);
        }));

        return () => {
            cleanupFunctions.forEach(cleanup => cleanup());
        };
    }, [userId]);

    // Operación para Añadir Locación
    const addLocation = useCallback(async (type: LocationType, data: any) => {
        if (!userId) {
            throw new Error('Usuario no autenticado.');
        }
        const path = getLocationCollectionPath(type);
        try {
            const docRef = await addDoc(collection(db, path), {
                ...data,
                nombre: data.nombre.trim(),
            });
            return docRef.id;
        } catch (e) {
            console.error(`Error al añadir ${type}: `, e);
            throw new Error(`Fallo al crear la ubicación: ${type}.`);
        }
    }, [userId]);

    return {
        paises,
        estados,
        ciudades,
        loading,
        addLocation,
    };
};

// --- Componente Raíz de la Aplicación (Ciudades) ---

const Ciudades: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showLoading, setShowLoading] = useState(true);

    // 1. Inicialización de Autenticación
    useEffect(() => {
        const tryAuth = async () => {
            try {
                if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
                    await signInWithCustomToken(auth, __initial_auth_token);
                } else {
                    await signInAnonymously(auth);
                }
            } catch (e) {
                console.error('Error durante la autenticación:', e);
            }
        };

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setIsAuthenticated(!!user);
            setShowLoading(false);
        });

        tryAuth();
        return () => unsubscribe();
    }, []);

    const userId = currentUser ? currentUser.uid : null;
    const { paises, estados, ciudades, loading: dataLoading, addLocation } = useLocationData(userId);

    // 2. Estados de Selección y Creación
    const [selectedPaisId, setSelectedPaisId] = useState<string>('');
    const [selectedEstadoId, setSelectedEstadoId] = useState<string>('');
    const [selectedCiudadId, setSelectedCiudadId] = useState<string>(''); // La que se guarda en LS
    
    const [newPaisName, setNewPaisName] = useState('');
    const [newStateName, setNewStateName] = useState('');
    const [newCiudadName, setNewCiudadName] = useState('');
    const [showCreationForm, setShowCreationForm] = useState<'pais' | 'estado' | 'ciudad' | null>(null);

    // --- EFECTOS DE PERSISTENCIA Y PRECARGA (Ciudad seleccionada) ---
    useEffect(() => {
        // Cargar la última ciudad seleccionada de localStorage
        const cityIdFromStorage = localStorage.getItem(LS_KEY_SELECTED_ID);
        if (cityIdFromStorage && ciudades.length > 0) {
            const ciudad = ciudades.find(c => c.id === cityIdFromStorage);
            if (ciudad) {
                setSelectedCiudadId(ciudad.id);
                setSelectedEstadoId(ciudad.estado_id);
                setSelectedPaisId(ciudad.pais_id);
            }
        }
    }, [ciudades, estados, paises]); // Depende de la carga inicial de datos de Firestore

    // Guardar el ID de la ciudad seleccionada en localStorage (persistencia local de la selección)
    useEffect(() => {
        if (selectedCiudadId) {
            localStorage.setItem(LS_KEY_SELECTED_ID, selectedCiudadId);
        } else {
            localStorage.removeItem(LS_KEY_SELECTED_ID);
        }
    }, [selectedCiudadId]);

    // --- LÓGICA DE FILTRADO Y NOMBRE COMPLETO ---

    const filteredEstados = useMemo(() => {
        return estados.filter(e => e.pais_id === selectedPaisId);
    }, [estados, selectedPaisId]);

    const filteredCiudades = useMemo(() => {
        return ciudades.filter(c => c.estado_id === selectedEstadoId);
    }, [ciudades, selectedEstadoId]);

    const currentCityName = useMemo(() => {
        const ciudad = ciudades.find(c => c.id === selectedCiudadId);
        if (!ciudad) return null;
        
        const estado = estados.find(e => e.id === ciudad.estado_id)?.nombre || 'Estado Desconocido';
        const pais = paises.find(p => p.id === ciudad.pais_id)?.nombre || 'País Desconocido';

        return `${ciudad.nombre} (${estado}, ${pais})`;
    }, [selectedCiudadId, ciudades, estados, paises]);


    // --- LÓGICA DE CREACIÓN DE ELEMENTOS (Guarda en Firestore) ---

    const handleCreateLocation = useCallback(async (type: 'pais' | 'estado' | 'ciudad') => {
        try {
            if (type === 'pais' && newPaisName.trim()) {
                const newId = await addLocation('pais', { nombre: newPaisName.trim() });
                setSelectedPaisId(newId);
                setNewPaisName('');
            } else if (type === 'estado' && newStateName.trim() && selectedPaisId) {
                const newId = await addLocation('estado', { 
                    nombre: newStateName.trim(), 
                    pais_id: selectedPaisId 
                });
                setSelectedEstadoId(newId);
                setNewStateName('');
            } else if (type === 'ciudad' && newCiudadName.trim() && selectedEstadoId) {
                const newId = await addLocation('ciudad', { 
                    nombre: newCiudadName.trim(), 
                    estado_id: selectedEstadoId,
                    pais_id: selectedPaisId, // Guardar el ID del país para la precarga
                });
                setSelectedCiudadId(newId);
                setNewCiudadName('');
            }
            setShowCreationForm(null); // Ocultar el formulario después de crear
        } catch (error) {
            console.error('Error al crear ubicación:', error);
            alert(`Error al guardar en Firestore. Revisa la consola.`);
        }
    }, [newPaisName, newStateName, newCiudadName, selectedPaisId, selectedEstadoId, addLocation]);

    // --- MANEJADORES DE CAMBIO (CASCADA Y CREACIÓN) ---
    
    const handlePaisChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const id = event.target.value;
        setSelectedPaisId(id);
        setSelectedEstadoId('');
        setSelectedCiudadId('');
        setShowCreationForm(null);
        if (id === CREATE_NEW_OPTION) {
            setShowCreationForm('pais');
            setSelectedPaisId('');
        }
    };

    const handleEstadoChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const id = event.target.value;
        setSelectedEstadoId(id);
        setSelectedCiudadId('');
        setShowCreationForm(null);
        if (id === CREATE_NEW_OPTION) {
            setShowCreationForm('estado');
            setSelectedEstadoId('');
        }
    };

    const handleCiudadChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const id = event.target.value;
        setSelectedCiudadId(id);
        setShowCreationForm(null);
        if (id === CREATE_NEW_OPTION) {
            setShowCreationForm('ciudad');
            setSelectedCiudadId('');
        }
    };

    if (!isAuthenticated || showLoading || dataLoading) {
        return (
            <div className={`${styles.cityContainer} ${styles.centeredText}`}>
                <h1 className={styles.boldText}>Conectando a la Base de Datos...</h1>
                {/* Puedes añadir un spinner o indicador de carga aquí */}
                <p>Estado de Auth: {isAuthenticated ? 'Autenticado' : 'No Autenticado'}</p>
                <p>Cargando Datos: {dataLoading ? 'Sí' : 'No'}</p>
                <p>UID: {userId || 'N/A'}</p>
            </div>
        );
    }

    return (
        <div className={`${styles.cityContainer} ${styles.centeredText}`}>
            <div className={styles.marginBottom16}>
                {currentCityName ? (
                    <h1 className={styles.boldText}>Ubicación Actual: {currentCityName}</h1>
                ) : (
                    <h1 className={styles.boldText}>Selecciona la Ubicación del Negocio</h1>
                )}
            </div>

            {/* 1. SELECTOR DE PAÍS */}
            <div className={styles.selectGroup}>
                <label>1. País (Colecciones: {paises.length})</label>
                <select
                    value={showCreationForm === 'pais' ? CREATE_NEW_OPTION : selectedPaisId || ""}
                    onChange={handlePaisChange}
                    className={styles.selectInput}
                    disabled={showCreationForm !== null && showCreationForm !== 'pais'}
                >
                    <option value="" disabled>Selecciona o crea un País</option>
                    {paises.map(p => (
                        <option key={p.id} value={p.id}>{p.nombre}</option>
                    ))}
                    <option value={CREATE_NEW_OPTION}>[ + Crear nuevo País ]</option>
                </select>
            </div>

            {/* FORMULARIO DE CREACIÓN DE PAÍS */}
            {showCreationForm === 'pais' && (
                <div className={styles.creationForm}>
                    <input
                        type="text"
                        placeholder="Nombre del País (Ej: Italia)"
                        value={newPaisName}
                        onChange={(e) => setNewPaisName(e.target.value)}
                        className={styles.textInput}
                    />
                    <button 
                        onClick={() => handleCreateLocation('pais')} 
                        disabled={!newPaisName.trim()} 
                        className={styles.createButton}
                    >
                        Guardar en Firestore
                    </button>
                    <button onClick={() => setShowCreationForm(null)} className={styles.cancelButton}>
                        Cancelar
                    </button>
                </div>
            )}

            {/* 2. SELECTOR DE ESTADO */}
            <div className={styles.selectGroup} style={{ marginTop: '15px' }}>
                <label>2. Estado/Provincia (Colecciones: {filteredEstados.length})</label>
                <select
                    value={showCreationForm === 'estado' ? CREATE_NEW_OPTION : selectedEstadoId || ""}
                    onChange={handleEstadoChange}
                    disabled={!selectedPaisId || showCreationForm !== null && showCreationForm !== 'estado'}
                    className={styles.selectInput}
                >
                    <option value="" disabled>{selectedPaisId ? "Selecciona o Crea un Estado" : "Selecciona primero un País"}</option>
                    {filteredEstados.map(e => (
                        <option key={e.id} value={e.id}>{e.nombre}</option>
                    ))}
                    {selectedPaisId && <option value={CREATE_NEW_OPTION}>[ + Crear nuevo Estado ]</option>}
                </select>
            </div>

            {/* FORMULARIO DE CREACIÓN DE ESTADO */}
            {showCreationForm === 'estado' && selectedPaisId && (
                <div className={styles.creationForm}>
                    <input
                        type="text"
                        placeholder={`Nombre del Estado en ${paises.find(p => p.id === selectedPaisId)?.nombre}`}
                        value={newStateName}
                        onChange={(e) => setNewStateName(e.target.value)}
                        className={styles.textInput}
                    />
                    <button 
                        onClick={() => handleCreateLocation('estado')} 
                        disabled={!newStateName.trim()} 
                        className={styles.createButton}
                    >
                        Guardar en Firestore
                    </button>
                    <button onClick={() => setShowCreationForm(null)} className={styles.cancelButton}>
                        Cancelar
                    </button>
                </div>
            )}

            {/* 3. SELECTOR DE CIUDAD */}
            <div className={styles.selectGroup} style={{ marginTop: '15px' }}>
                <label>3. Ciudad (Colecciones: {filteredCiudades.length})</label>
                <select
                    value={showCreationForm === 'ciudad' ? CREATE_NEW_OPTION : selectedCiudadId || ""}
                    onChange={handleCiudadChange}
                    disabled={!selectedEstadoId || showCreationForm !== null && showCreationForm !== 'ciudad'}
                    className={styles.selectInput}
                >
                    <option value="" disabled>{selectedEstadoId ? "Selecciona o Crea una Ciudad" : "Selecciona primero un Estado"}</option>
                    {filteredCiudades.map(c => (
                        <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                    {selectedEstadoId && <option value={CREATE_NEW_OPTION}>[ + Crear nueva Ciudad ]</option>}
                </select>
            </div>

            {/* FORMULARIO DE CREACIÓN DE CIUDAD */}
            {showCreationForm === 'ciudad' && selectedEstadoId && (
                <div className={styles.creationForm}>
                    <input
                        type="text"
                        placeholder={`Nombre de la Ciudad (Ej: Roma)`}
                        value={newCiudadName}
                        onChange={(e) => setNewCiudadName(e.target.value)}
                        className={styles.textInput}
                    />
                    <button 
                        onClick={() => handleCreateLocation('ciudad')} 
                        disabled={!newCiudadName.trim()} 
                        className={styles.createButton}
                    >
                        Guardar en Firestore
                    </button>
                    <button onClick={() => setShowCreationForm(null)} className={styles.cancelButton}>
                        Cancelar
                    </button>
                </div>
            )}
            
            {/* Indicador Final */}
            {(selectedCiudadId && showCreationForm === null) && (
                <div className={styles.noteText} style={{ marginTop: '20px', padding: '10px', border: '1px solid #28a745', borderRadius: '5px' }}>
                    ✅ **Ubicación Registrada y Seleccionada:**
                    <p>
                        **{currentCityName}**
                    </p>
                </div>
            )}
        </div>
    );
};

export default Ciudades;