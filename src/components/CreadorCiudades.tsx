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
  IonSelectOption
} from '@ionic/react';
import {
  addDocument,
  getDocuments,
  updateDocument,
  deleteDocument,
  ciudadesCollection, // Colección de ciudades
  estadosCollection // Para el menú desplegable de estados
} from '../service/database';
import { Ciudad, Estado } from '../types/types';

type ViewMode = 'list' | 'create';

const CreadorCiudades: React.FC = () => {
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [estados, setEstados] = useState<Estado[]>([]); // Se cambia 'paises' a 'estados'
  const [nombreCiudad, setNombreCiudad] = useState('');
  const [estadoSeleccionadoId, setEstadoSeleccionadoId] = useState(''); // Se cambia 'paisSeleccionadoId' a 'estadoSeleccionadoId'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingCiudad, setEditingCiudad] = useState<Ciudad | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [ciudadToDelete, setCiudadToDelete] = useState<string | undefined>(undefined);
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  useEffect(() => {
    fetchCiudades();
    fetchEstados(); // Se carga la lista de estados al iniciar
  }, []);

  const fetchCiudades = async () => {
    setLoading(true);
    try {
      const { data } = await getDocuments<Ciudad>(ciudadesCollection);
      setCiudades(data);
    } catch (err) {
      setError('Error al cargar la lista de ciudades.');
    } finally {
      setLoading(false);
    }
  };

  const fetchEstados = async () => {
    try {
      const { data } = await getDocuments<Estado>(estadosCollection);
      setEstados(data);
    } catch (err) {
      setError('Error al cargar la lista de estados.');
    }
  };

  const handleAddOrUpdate = async () => {
    if (!nombreCiudad.trim() || !estadoSeleccionadoId.trim()) {
      setError('El nombre de la ciudad y el estado no pueden estar vacíos.');
      return;
    }
    setLoading(true);
    try {
      if (editingCiudad) {
        await updateDocument(ciudadesCollection, editingCiudad.id!, {
          nombre: nombreCiudad,
          estado_id: estadoSeleccionadoId, // Se cambia 'pais_id' a 'estado_id'
        });
      } else {
        await addDocument(ciudadesCollection, {
          nombre: nombreCiudad,
          estado_id: estadoSeleccionadoId, // Se cambia 'pais_id' a 'estado_id'
        });
      }
      setNombreCiudad('');
      setEstadoSeleccionadoId('');
      setEditingCiudad(null);
      setViewMode('list');
      await fetchCiudades();
    } catch (err) {
      setError('Error al guardar la ciudad.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string | undefined) => {
    if (id) {
      setCiudadToDelete(id);
      setShowAlert(true);
    }
  };

  const confirmDelete = async () => {
    if (ciudadToDelete) {
      setLoading(true);
      try {
        await deleteDocument(ciudadesCollection, ciudadToDelete);
        await fetchCiudades();
      } catch (err) {
        setError('Error al eliminar la ciudad.');
      } finally {
        setLoading(false);
        setCiudadToDelete(undefined);
      }
    }
  };

  const handleEditCiudad = (ciudad: Ciudad) => {
    setEditingCiudad(ciudad);
    setNombreCiudad(ciudad.nombre);
    setEstadoSeleccionadoId(ciudad.estado_id); // Se cambia 'pais_id' a 'estado_id'
    setViewMode('create');
  };

  const handleCancel = () => {
    setNombreCiudad('');
    setEstadoSeleccionadoId('');
    setEditingCiudad(null);
    setViewMode('list');
  };

  const handleAddNew = () => {
    setNombreCiudad('');
    setEstadoSeleccionadoId('');
    setEditingCiudad(null);
    setViewMode('create');
  };

  const renderContent = () => {
    if (viewMode === 'list') {
      return (
        <>
          <h2>Lista de Ciudades</h2>
          <IonButton expand="block" onClick={handleAddNew}>Agregar Nueva Ciudad</IonButton>
          {ciudades.length > 0 ? (
            <IonList>
              {ciudades.map(ciudad => (
                <IonItem key={ciudad.id}>
                  <IonLabel>
                    {ciudad.nombre} ({estados.find(e => e.id === ciudad.estado_id)?.nombre || 'N/A'})
                  </IonLabel>
                  <IonButton onClick={() => handleEditCiudad(ciudad)}>Editar</IonButton>
                  <IonButton color="danger" onClick={() => handleDelete(ciudad.id)}>Eliminar</IonButton>
                </IonItem>
              ))}
            </IonList>
          ) : (
            <IonItem>
              <IonLabel>Aún no hay ciudades.</IonLabel>
            </IonItem>
          )}
        </>
      );
    } else if (viewMode === 'create') {
      return (
        <>
          <h2>{editingCiudad ? 'Editar Ciudad' : 'Agregar Ciudad'}</h2>
          <IonItem>
            <IonLabel position="floating">Nombre de la Ciudad</IonLabel>
            <IonInput value={nombreCiudad} onIonChange={e => setNombreCiudad(e.detail.value!)} />
          </IonItem>
          <IonItem>
            <IonLabel>Estado</IonLabel>
            <IonSelect
              value={estadoSeleccionadoId}
              placeholder="Selecciona un estado"
              onIonChange={e => setEstadoSeleccionadoId(e.detail.value)}
            >
              {estados.map(estado => (
                <IonSelectOption key={estado.id} value={estado.id}>
                  {estado.nombre}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>
          <IonButton expand="block" onClick={handleAddOrUpdate}>
            {editingCiudad ? 'Actualizar' : 'Agregar'}
          </IonButton>
          <IonButton expand="block" onClick={handleCancel}>
            Cancelar
          </IonButton>
        </>
      );
    }
    return null;
  };

  return (
    <>
      <IonLoading isOpen={loading} message="Cargando..." />
      {error && <p>{error}</p>}
      {renderContent()}
      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header="Confirmar Eliminación"
        message="¿Estás seguro de que quieres eliminar esta ciudad?"
        buttons={[
          { text: 'Cancelar', role: 'cancel' },
          { text: 'Eliminar', handler: confirmDelete },
        ]}
      />
    </>
  );
};

export default CreadorCiudades;