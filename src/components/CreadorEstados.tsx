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
  updateDocument,
  deleteDocument,
  estadosCollection,
  paisesCollection,
} from '../service/database';
import { Estado, Pais } from '../types/types';

type ViewMode = 'list' | 'create';

const CreadorEstados: React.FC = () => {
  const [estados, setEstados] = useState<Estado[]>([]);
  const [paises, setPaises] = useState<Pais[]>([]);
  const [nombreEstado, setNombreEstado] = useState('');
  const [paisSeleccionadoId, setPaisSeleccionadoId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingEstado, setEditingEstado] = useState<Estado | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [estadoToDelete, setEstadoToDelete] = useState<string | undefined>(undefined);
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  useEffect(() => {
    fetchEstados();
    fetchPaises();
  }, []);

  const fetchEstados = async () => {
    setLoading(true);
    try {
      const { data } = await getDocuments<Estado>(estadosCollection);
      setEstados(data);
    } catch (err) {
      setError('Error al cargar la lista de estados.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPaises = async () => {
    try {
      const { data } = await getDocuments<Pais>(paisesCollection);
      setPaises(data);
    } catch (err) {
      setError('Error al cargar la lista de países.');
    }
  };

  const handleAddOrUpdate = async () => {
    if (!nombreEstado.trim() || !paisSeleccionadoId.trim()) {
      setError('El nombre del estado y el país no pueden estar vacíos.');
      return;
    }
    setLoading(true);
    try {
      if (editingEstado) {
        await updateDocument(estadosCollection, editingEstado.id!, {
          nombre: nombreEstado,
          pais_id: paisSeleccionadoId,
        });
      } else {
        await addDocument(estadosCollection, {
          nombre: nombreEstado,
          pais_id: paisSeleccionadoId,
        });
      }
      setNombreEstado('');
      setPaisSeleccionadoId('');
      setEditingEstado(null);
      setViewMode('list');
      await fetchEstados();
    } catch (err) {
      setError('Error al guardar el estado.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string | undefined) => {
    if (id) {
      setEstadoToDelete(id);
      setShowAlert(true);
    }
  };

  const confirmDelete = async () => {
    if (estadoToDelete) {
      setLoading(true);
      try {
        await deleteDocument(estadosCollection, estadoToDelete);
        await fetchEstados();
      } catch (err) {
        setError('Error al eliminar el estado.');
      } finally {
        setLoading(false);
        setEstadoToDelete(undefined);
      }
    }
  };

  const handleEditEstado = (estado: Estado) => {
    setEditingEstado(estado);
    setNombreEstado(estado.nombre);
    setPaisSeleccionadoId(estado.pais_id);
    setViewMode('create');
  };

  const handleCancel = () => {
    setNombreEstado('');
    setPaisSeleccionadoId('');
    setEditingEstado(null);
    setViewMode('list');
  };

  const handleAddNew = () => {
    setNombreEstado('');
    setPaisSeleccionadoId('');
    setEditingEstado(null);
    setViewMode('create');
  };

  const renderContent = () => {
    if (viewMode === 'list') {
      return (
        <>
          <h2>Lista de Estados</h2>
          <IonButton expand="block" onClick={handleAddNew}>Agregar Nuevo Estado</IonButton>
          {estados.length > 0 ? (
            <IonList>
              {estados.map(estado => (
                <IonItem key={estado.id}>
                  <IonLabel>
                    {estado.nombre} ({paises.find(p => p.id === estado.pais_id)?.nombre || 'N/A'})
                  </IonLabel>
                  <IonButton onClick={() => handleEditEstado(estado)}>Editar</IonButton>
                  <IonButton color="danger" onClick={() => handleDelete(estado.id)}>Eliminar</IonButton>
                </IonItem>
              ))}
            </IonList>
          ) : (
            <IonItem>
              <IonLabel>Aún no hay estados.</IonLabel>
            </IonItem>
          )}
        </>
      );
    } else if (viewMode === 'create') {
      return (
        <>
          <h2>{editingEstado ? 'Editar Estado' : 'Agregar Estado'}</h2>
          <IonItem>
            <IonLabel position="floating">Nombre del Estado</IonLabel>
            <IonInput value={nombreEstado} onIonChange={e => setNombreEstado(e.detail.value!)} />
          </IonItem>
          <IonItem>
            <IonLabel>País</IonLabel>
            <IonSelect
              value={paisSeleccionadoId}
              placeholder="Selecciona un país"
              onIonChange={e => setPaisSeleccionadoId(e.detail.value)}
            >
              {paises.map(pais => (
                <IonSelectOption key={pais.id} value={pais.id}>
                  {pais.nombre}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>
          <IonButton expand="block" onClick={handleAddOrUpdate}>
            {editingEstado ? 'Actualizar' : 'Agregar'}
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
        message="¿Estás seguro de que quieres eliminar este estado?"
        buttons={[
          { text: 'Cancelar', role: 'cancel' },
          { text: 'Eliminar', handler: confirmDelete },
        ]}
      />
    </>
  );
};

export default CreadorEstados;