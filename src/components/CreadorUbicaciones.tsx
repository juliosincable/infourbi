import React, { useState, useEffect } from 'react';
import {
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonInput,
  IonLoading,
  IonAlert,
  IonSelect,
  IonSelectOption,
} from '@ionic/react';
import {
  addDocument,
  getDocuments,
  paisesCollection,
  estadosCollection,
  ciudadesCollection,
} from '../service/database';
import { Pais, Estado, Ciudad } from '../types/types';

const CreadorUbicaciones: React.FC = () => {
  const [paises, setPaises] = useState<Pais[]>([]);
  const [estados, setEstados] = useState<Estado[]>([]);
  const [estadosFiltrados, setEstadosFiltrados] = useState<Estado[]>([]);
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);

  const [paisSeleccionadoId, setPaisSeleccionadoId] = useState('');
  const [estadoSeleccionadoId, setEstadoSeleccionadoId] = useState('');
  const [nombreCiudad, setNombreCiudad] = useState('');
  const [nombrePaisNuevo, setNombrePaisNuevo] = useState('');
  const [nombreEstadoNuevo, setNombreEstadoNuevo] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar todos los datos al iniciar
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: paisesData } = await getDocuments<Pais>(paisesCollection);
      const { data: estadosData } = await getDocuments<Estado>(estadosCollection);
      const { data: ciudadesData } = await getDocuments<Ciudad>(ciudadesCollection);
      setPaises(paisesData);
      setEstados(estadosData);
      setCiudades(ciudadesData);
    } catch (err) {
      setError('Error al cargar los datos.');
    } finally {
      setLoading(false);
    }
  };

  // Filtrar estados cuando se selecciona un país
  useEffect(() => {
    if (paisSeleccionadoId) {
      const filtered = estados.filter(estado => estado.pais_id === paisSeleccionadoId);
      setEstadosFiltrados(filtered);
    } else {
      setEstadosFiltrados([]);
    }
    // Restablecer el estado seleccionado
    setEstadoSeleccionadoId('');
  }, [paisSeleccionadoId, estados]);

  const handlePaisChange = (e: any) => {
    const selectedId = e.detail.value;
    setPaisSeleccionadoId(selectedId);
    setNombrePaisNuevo(''); // Limpiar el campo del nuevo país
  };

  const handleEstadoChange = (e: any) => {
    const selectedId = e.detail.value;
    setEstadoSeleccionadoId(selectedId);
    setNombreEstadoNuevo(''); // Limpiar el campo del nuevo estado
  };

  const handleAddCiudad = async () => {
    setLoading(true);
    setError(null);

    // 1. Validar que la ciudad no esté vacía
    if (!nombreCiudad.trim()) {
      setError('El nombre de la ciudad no puede estar vacío.');
      setLoading(false);
      return;
    }

    let finalPaisId = paisSeleccionadoId;
    let finalEstadoId = estadoSeleccionadoId;

    try {
      // 2. Crear país si es necesario
      if (paisSeleccionadoId === 'nuevo' && nombrePaisNuevo.trim()) {
        finalPaisId = await addDocument(paisesCollection, { nombre: nombrePaisNuevo });
      }

      // 3. Crear estado si es necesario
      if (estadoSeleccionadoId === 'nuevo' && nombreEstadoNuevo.trim()) {
        finalEstadoId = await addDocument(estadosCollection, {
          nombre: nombreEstadoNuevo,
          pais_id: finalPaisId,
        });
      }

      // 4. Agregar la ciudad
      await addDocument(ciudadesCollection, {
        nombre: nombreCiudad,
        estado_id: finalEstadoId,
      });

      // 5. Limpiar y recargar datos
      setNombreCiudad('');
      setPaisSeleccionadoId('');
      setEstadoSeleccionadoId('');
      setNombrePaisNuevo('');
      setNombreEstadoNuevo('');
      await fetchData(); // Recargar los datos para actualizar las listas
    } catch (err) {
      setError('Error al guardar la ciudad. Por favor, inténtelo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonList>
      <IonLoading isOpen={loading} message="Cargando..." />
      {error && <p className="error-message">{error}</p>}
      
      {/* 1. Selección de País */}
      <IonItem>
        <IonLabel>País</IonLabel>
        <IonSelect
          value={paisSeleccionadoId}
          placeholder="Selecciona un país"
          onIonChange={handlePaisChange}
        >
          <IonSelectOption value="nuevo">Crear nuevo país</IonSelectOption>
          {paises.map(pais => (
            <IonSelectOption key={pais.id} value={pais.id}>{pais.nombre}</IonSelectOption>
          ))}
        </IonSelect>
      </IonItem>

      {/* Campo para nuevo país (condicional) */}
      {paisSeleccionadoId === 'nuevo' && (
        <IonItem>
          <IonLabel position="floating">Nombre del nuevo país</IonLabel>
          <IonInput value={nombrePaisNuevo} onIonChange={e => setNombrePaisNuevo(e.detail.value!)} />
        </IonItem>
      )}

      {/* 2. Selección de Estado (condicional) */}
      {(paisSeleccionadoId && paisSeleccionadoId !== 'nuevo') && (
        <IonItem>
          <IonLabel>Estado</IonLabel>
          <IonSelect
            value={estadoSeleccionadoId}
            placeholder="Selecciona un estado"
            onIonChange={handleEstadoChange}
          >
            <IonSelectOption value="nuevo">Crear nuevo estado</IonSelectOption>
            {estadosFiltrados.map(estado => (
              <IonSelectOption key={estado.id} value={estado.id}>{estado.nombre}</IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>
      )}

      {/* Campo para nuevo estado (condicional) */}
      {(estadoSeleccionadoId === 'nuevo' && (paisSeleccionadoId && paisSeleccionadoId !== 'nuevo')) && (
        <IonItem>
          <IonLabel position="floating">Nombre del nuevo estado</IonLabel>
          <IonInput value={nombreEstadoNuevo} onIonChange={e => setNombreEstadoNuevo(e.detail.value!)} />
        </IonItem>
      )}
      
      {/* 3. Campo de Ciudad */}
      {(paisSeleccionadoId && (paisSeleccionadoId === 'nuevo' || (estadoSeleccionadoId && estadoSeleccionadoId !== 'nuevo'))) && (
        <>
          <IonItem>
            <IonLabel position="floating">Nombre de la ciudad</IonLabel>
            <IonInput value={nombreCiudad} onIonChange={e => setNombreCiudad(e.detail.value!)} />
          </IonItem>
          <IonButton expand="block" onClick={handleAddCiudad}>
            Agregar Ciudad
          </IonButton>
        </>
      )}
    </IonList>
  );
};

export default CreadorUbicaciones;