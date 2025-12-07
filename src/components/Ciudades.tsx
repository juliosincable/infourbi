import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styles from './Ciudades.module.scss';

// --- Dependencias de Firebase ---
import { User } from 'firebase/auth';
import { collection, addDoc, getDocs, query } from 'firebase/firestore'; 
import { db, auth } from '../service/firebaseConfig';
import { signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';

// --- Definiciones de Tipos de Datos ---
interface Pais {
    id: string;
    nombre: string;
}

interface Estado {
    id: string;
    nombre: string;
    pais_id: string;
}

interface Ciudad {
    id: string;
    nombre: string;
    estado_id: string;
    pais_id: string;
}

type LocationType = 'pais' | 'estado' | 'ciudad';

// --- Globales de Firebase (Declaraciones Asumidas) ---
declare const __app_id: string;
declare const __firebase_config: string;
declare const __initial_auth_token: string;

const appId = (typeof __app_id !== 'undefined' && __app_id.trim() !== '') ? __app_id : 'default-app-id-999';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

const CREATE_NEW_OPTION = 'CREATE_NEW';
const LS_KEY_SELECTED_ID = 'firebase_selected_ciudad_id'; 

// ----------------------------------------------------------------------
// --- Custom Hook para Lógica de Firestore y Estado Centralizado ---
// ----------------------------------------------------------------------

const useLocationData = (userId: string | null) => {
    const [paises, setPaises] = useState<Pais[]>([]);
    const [estados, setEstados] = useState<Estado[]>([]);
    const [ciudades, setCiudades] = useState<Ciudad[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // FUNCIÓN DE RUTA SIMPLIFICADA Y CENTRALIZADA
    const getLocationCollectionPath = useCallback((type: LocationType) => {
        let collectionName;
        switch (type) {
            case 'pais': collectionName = 'paises'; break;
            case 'estado': collectionName = 'estados'; break;
            case 'ciudad': collectionName = 'ciudades'; break;
            default: throw new Error('Tipo de colección desconocido.');
        }
        return collectionName; 
    }, []);


    // --- Función para CARGAR DATOS (fetchLocations) ---
    const fetchLocations = useCallback(async () => {
        // [CORRECCIÓN 1 - BLOQUEO DE LECTURA]:
        if (!userId) {
            setLoading(false);
            // 📢 1. LOG DE BLOQUEO: Si el userId es null, la función se detiene antes de Firestore.
            console.log('📢 1. INFO: fetchLocations BLOQUEADA. userId es NULL.');
            return;
        }

        setLoading(true);
        setError(null);
        
        // 📢 2. LOG DE INICIO DE LECTURA: Se inicia la lectura con un UID válido.
        console.log('📢 2. INFO: fetchLocations INICIADA con UID:', userId);


        try {
            const pathPaises = getLocationCollectionPath('pais');
            const pathEstados = getLocationCollectionPath('estado');
            const pathCiudades = getLocationCollectionPath('ciudad');

            // Cargar Países
            const qPaises = query(collection(db, pathPaises));
            const snapshotPaises = await getDocs(qPaises);
            const dataPaises: Pais[] = snapshotPaises.docs.map(doc => ({ id: doc.id, nombre: doc.data().nombre }));
            setPaises(dataPaises);

            // Cargar Estados
            const qEstados = query(collection(db, pathEstados));
            const snapshotEstados = await getDocs(qEstados);
            const dataEstados: Estado[] = snapshotEstados.docs.map(doc => ({ 
                id: doc.id, 
                nombre: doc.data().nombre,
                pais_id: doc.data().pais_id,
            }));
            setEstados(dataEstados);

            // Cargar Ciudades
            const qCiudades = query(collection(db, pathCiudades));
            const snapshotCiudades = await getDocs(qCiudades);
            const dataCiudades: Ciudad[] = snapshotCiudades.docs.map(doc => ({ 
                id: doc.id, 
                nombre: doc.data().nombre,
                estado_id: doc.data().estado_id,
                pais_id: doc.data().pais_id,
            }));
            setCiudades(dataCiudades);

            // 📢 3. LOG DE ÉXITO DE LECTURA: Se han cargado los datos.
            console.log(`📢 3. ÉXITO FIRESTORE: Países cargados: ${dataPaises.length}, Estados: ${dataEstados.length}, Ciudades: ${dataCiudades.length}`);


        } catch (err: unknown) {
            // 📢 4. LOG DE ERROR CRÍTICO: Muestra el error si Firestore falla por permisos.
            console.error("📢 4. ERROR CRÍTICO FIRESTORE:", err);
            // Mensaje de error más detallado
            setError(`Error de Conexión: ${(err as Error).message}. (El servidor de Firebase denegó la lectura. Verifique la Autenticación/Reglas)`);
        } finally {
            setLoading(false);
        }
    }, [userId, getLocationCollectionPath]);


    // [CORRECCIÓN 2 - ESPERA EN EL EFECTO]:
    // Ejecuta la carga de datos SOLO si el userId es válido.
    useEffect(() => {
        if (userId) { 
            fetchLocations();
        }
    }, [userId, fetchLocations]);


    // Operación para Añadir Locación (addLocation)
    const addLocation = async (type: LocationType, data: Record<string, unknown>) => {
        
        const path = getLocationCollectionPath(type);
        let newDocId = '';
        
        try {
            const docRef = await addDoc(collection(db, path), {
                ...data,
                nombre: (data.nombre as string).trim(),
            });
            newDocId = docRef.id;

            await fetchLocations(); // Recarga los datos inmediatamente
            
            // 📢 5. LOG DE ESCRITURA: Se ha escrito un nuevo documento.
            console.log(`📢 5. ESCRITURA FIRESTORE: Nuevo ${type} creado con ID: ${newDocId}`);

            return newDocId;
        } catch (e) {
            const error = e as Error;
            console.error(`Error detallado al añadir ${type}: `, error);
            
            alert(`🔴 ¡ERROR CRÍTICO AL GUARDAR! Mensaje: ${error.message}. (Verifique que su UID tenga 'isAdmin: true')`); 

            throw new Error(`Fallo al crear la ubicación: ${type}.`);
        }
    };

    return {
        paises,
        estados,
        ciudades,
        loading,
        error,
        addLocation,
    };
};

// ----------------------------------------------------------------------
// --- Componente Raíz de la Aplicación (Ciudades) ---
// ----------------------------------------------------------------------

const Ciudades: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    // showLoading debe ser true inicialmente para dar tiempo a Auth
    const [showLoading, setShowLoading] = useState(true); 

    // 1. Inicialización de Autenticación (Bloque Robusto)
    useEffect(() => {
        
        const tryAuth = async () => {
            try {
                if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
                    await signInWithCustomToken(auth, __initial_auth_token);
                } else {
                    await signInAnonymously(auth);
                }
            } catch (e) {
                console.error('Error FATAL durante la autenticación:', e);
                // Si Auth falla, aún debemos apagar la carga.
                setShowLoading(false); 
            }
        };

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            // 📢 6. LOG CRÍTICO DE AUTH: Te dice el estado final de la autenticación.
            console.log('📢 6. AUTH RESULTADO FINAL: Objeto USER es:', user); 
            
            // [CORRECCIÓN 3]: onAuthStateChanged establece el resultado final de Auth
            setCurrentUser(user);
            setIsAuthenticated(!!user);
            // Solo apagamos la pantalla de carga cuando Auth ha finalizado.
            setShowLoading(false); 
        });

        tryAuth();
        return () => unsubscribe();
    }, []);

    const userId = currentUser ? currentUser.uid : null;
    const { paises, estados, ciudades, loading: dataLoading, error: dataError, addLocation } = useLocationData(userId);

    // 2. Estados de Selección y Creación (El resto del código permanece igual)
    const [selectedPaisId, setSelectedPaisId] = useState<string>('');
    const [selectedEstadoId, setSelectedEstadoId] = useState<string>('');
    const [selectedCiudadId, setSelectedCiudadId] = useState<string>(''); 
    
    const [newPaisName, setNewPaisName] = useState('');
    const [newStateName, setNewStateName] = useState('');
    const [newCiudadName, setNewCiudadName] = useState('');
    const [showCreationForm, setShowCreationForm] = useState<'pais' | 'estado' | 'ciudad' | null>(null);

    // --- EFECTOS DE PERSISTENCIA Y PRECARGA (Ciudad seleccionada) ---

    useEffect(() => {
        const cityIdFromStorage = localStorage.getItem(LS_KEY_SELECTED_ID);
        if (cityIdFromStorage && ciudades.length > 0) {
            const ciudad = ciudades.find(c => c.id === cityIdFromStorage);
            if (ciudad) {
                setSelectedCiudadId(ciudad.id);
                setSelectedEstadoId(ciudad.estado_id);
                setSelectedPaisId(ciudad.pais_id);
            }
        }
    }, [ciudades, estados, paises]);

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
                    pais_id: selectedPaisId,
                });
                setSelectedCiudadId(newId);
                setNewCiudadName('');
            }
            setShowCreationForm(null);
        } catch (error) {
            console.error('Error al crear ubicación, ya alertado:', error);
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

    // --- RENDERING ---

    if (dataError) {
        return (
            <div className={`${styles.cityContainer} ${styles.centeredText}`}>
                <h1 className={styles.boldText} style={{ color: 'red' }}>Error de Conexión</h1>
                <p style={{ color: 'red' }}>{dataError}</p>
                <p>UID actual: {userId || 'N/A'}</p>
                <p>Por favor, **cierre y reabra** el navegador para un nuevo intento de autenticación.</p>
            </div>
        );
    }

    if (!isAuthenticated || showLoading || dataLoading) {
        return (
            <div className={`${styles.cityContainer} ${styles.centeredText}`}>
                <h1 className={styles.boldText}>Conectando a la Base de Datos...</h1>
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