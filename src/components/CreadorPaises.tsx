import React, { useState, useEffect } from 'react';
import { IonList, IonItem, IonLabel, IonButton, IonInput, IonLoading, IonAlert } from '@ionic/react';
import { addDocument, getDocuments, updateDocument, deleteDocument, paisesCollection } from '../service/database';
import { Pais } from '../types/types';

type ViewMode = 'list' | 'create';

const CreadorPaises: React.FC = () => {
  const [paises, setPaises] = useState<Pais[]>([]);
  const [nombrePais, setNombrePais] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingPais, setEditingPais] = useState<Pais | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [paisToDelete, setPaisToDelete] = useState<string | undefined>(undefined);
  const [viewMode, setViewMode] = useState<ViewMode>('list'); // <-- Agregado el estado de la vista

  useEffect(() => {
    fetchPaises();
  }, []);

  const fetchPaises = async () => {
    setLoading(true);
    try {
      const { data } = await getDocuments<Pais>(paisesCollection);
      setPaises(data);
    } catch (err) {
      setError('Error al cargar la lista de países.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrUpdate = async () => {
    if (!nombrePais.trim()) {
      setError('El nombre del país no puede estar vacío.');
      return;
    }
    setLoading(true);
    try {
      if (editingPais) {
        await updateDocument(paisesCollection, editingPais.id!, { nombre: nombrePais });
      } else {
        await addDocument(paisesCollection, { nombre: nombrePais });
      }
      setNombrePais('');
      setEditingPais(null);
      setViewMode('list'); // <-- Vuelve a la lista después de guardar
      await fetchPaises();
    } catch (err) {
      setError('Error al guardar el país.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string | undefined) => {
    if (id) {
      setPaisToDelete(id);
      setShowAlert(true);
    }
  };

  const confirmDelete = async () => {
    if (paisToDelete) {
      setLoading(true);
      try {
        await deleteDocument(paisesCollection, paisToDelete);
        await fetchPaises();
      } catch (err) {
        setError('Error al eliminar el país.');
      } finally {
        setLoading(false);
        setPaisToDelete(undefined);
      }
    }
  };

  const handleEditPais = (pais: Pais) => {
    setEditingPais(pais);
    setNombrePais(pais.nombre);
    setViewMode('create'); // <-- Cambia a la vista de creación/edición
  };

  const handleCancel = () => {
    setNombrePais('');
    setEditingPais(null);
    setViewMode('list');
  };

  const handleAddNew = () => {
    setNombrePais('');
    setEditingPais(null);
    setViewMode('create');
  };
  
  // <-- Renderizado condicional basado en el estado de la vista -->
  const renderContent = () => {
    if (viewMode === 'list') {
      return (
        <>
          <h2>Lista de Países</h2>
          <IonButton expand="block" onClick={handleAddNew}>Agregar Nuevo País</IonButton>
          {paises.length > 0 ? (
            <IonList>
              {paises.map(pais => (
                <IonItem key={pais.id}>
                  <IonLabel>{pais.nombre}</IonLabel>
                  <IonButton onClick={() => handleEditPais(pais)}>Editar</IonButton>
                  <IonButton color="danger" onClick={() => handleDelete(pais.id)}>Eliminar</IonButton>
                </IonItem>
              ))}
            </IonList>
          ) : (
            <IonItem>
              <IonLabel>Aún no hay países.</IonLabel>
            </IonItem>
          )}
        </>
      );
    } else if (viewMode === 'create') {
      return (
        <>
          <h2>{editingPais ? 'Editar País' : 'Agregar País'}</h2>
          <IonItem>
            <IonLabel position="floating">Nombre del País</IonLabel>
            <IonInput value={nombrePais} onIonChange={e => setNombrePais(e.detail.value!)} />
          </IonItem>
          <IonButton expand="block" onClick={handleAddOrUpdate}>
            {editingPais ? 'Actualizar' : 'Agregar'}
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
        message="¿Estás seguro de que quieres eliminar este país?"
        buttons={[
          { text: 'Cancelar', role: 'cancel' },
          { text: 'Eliminar', handler: confirmDelete },
        ]}
      />
    </>
  );
};

export default CreadorPaises;