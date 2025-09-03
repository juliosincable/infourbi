// src/components/CreadorNegocios.tsx

import React, { useState, useEffect } from 'react';
import {
  IonButton,
  IonItem,
  IonLabel,
  IonInput,
  IonList,
  IonAlert,
  IonLoading,
  IonCard,
} from '@ionic/react';
import {
  addDocument,
  updateDocument,
  deleteDocument,
  getDocuments,
  negociosCollection,
} from '../service/database';
import { Negocio } from '../types/types';
import { IonInputCustomEvent, InputChangeEventDetail } from '@ionic/core';

const PROPIETARIO_ID_EJEMPLO = "propietario-123";
const initialState: Omit<Negocio, 'id'> = {
  nombre: '',
  propietario_id: PROPIETARIO_ID_EJEMPLO,
  whatsapp: '',
  instagram: '',
  direccion: '',
  tiktok: '',
  web: '',
  coordenadas: {
    lat: 0,
    lng: 0,
  },
  foto: '',
  codigoQr: '',
  administradores: [],
  logo: '',
  categoria: '',
  lugar: [],
};

type ViewMode = 'list' | 'create' | 'details';

const CreadorNegocios: React.FC = () => {
  const [negocios, setNegocios] = useState<Negocio[]>([]);
  const [negocioData, setNegocioData] = useState<Omit<Negocio, 'id'>>(initialState);
  const [negocioSeleccionado, setNegocioSeleccionado] = useState<Negocio | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [negocioToDelete, setNegocioToDelete] = useState<string | undefined>(undefined);
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  useEffect(() => {
    fetchNegocios();
  }, []);

  const fetchNegocios = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await getDocuments<Negocio>(negociosCollection);
      setNegocios(data);
    } catch (err) {
      console.error(err);
      setError('Error al cargar la lista de negocios.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: IonInputCustomEvent<InputChangeEventDetail>) => {
    const { name, value } = e.target;
    if (!name) return;

    setNegocioData(prevData => {
      const newData = { ...prevData };
      if (name.startsWith('coordenadas.')) {
        const coordName = name.split('.')[1] as 'lat' | 'lng';
        const parsedValue = parseFloat(value?.toString() || '');
        newData.coordenadas = {
          ...newData.coordenadas,
          [coordName]: isNaN(parsedValue) ? 0 : parsedValue,
        };
      } else if (name === 'administradores') {
        const adminValues = (value?.toString() || '').split(',').map(item => item.trim());
        newData.administradores = adminValues;
      } else if (name === 'lugar') {
        const lugarValues = (value?.toString() || '').split(',').map(item => item.trim());
        newData.lugar = lugarValues;
      } else {
        const key = name as keyof typeof newData;
        // Se asegura que la propiedad existe en el objeto antes de asignar
        if (key in newData) {
          // El tipo de 'key' ahora es un tipo válido para el indexado
          // El 'value' se convierte a string para que no haya problemas con 'string[]' o 'coordenadas'
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          // La línea de abajo causaba el error. Lo he manejado arriba
          newData[key] = typeof value === 'string' || typeof value === 'number' ? String(value) : value;
        }
      }
      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!negocioData.nombre.trim()) {
      setMessage('El nombre del negocio no puede estar vacío.');
      return;
    }

    try {
      setIsLoading(true);
      if (negocioSeleccionado) {
        if (negocioSeleccionado.id) {
          await updateDocument(negociosCollection, negocioSeleccionado.id, negocioData);
          setMessage('Negocio actualizado con éxito.');
          setNegocios(prevNegocios =>
            prevNegocios.map(neg =>
              neg.id === negocioSeleccionado.id ? { id: negocioSeleccionado.id, ...negocioData } : neg
            )
          );
          setNegocioSeleccionado({ id: negocioSeleccionado.id, ...negocioData });
          setViewMode('details');
        }
      } else {
        const newDocId = await addDocument(negociosCollection, negocioData);
        setMessage('Negocio agregado con éxito.');
        setNegocios(prevNegocios => [...prevNegocios, { id: newDocId, ...negocioData }]);
        handleClearSelection();
        setViewMode('list');
      }
    } catch (err) {
      console.error(err);
      setError('No se pudo guardar el negocio.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewNegocio = (negocio: Negocio) => {
    setNegocioSeleccionado(negocio);
    setNegocioData({
      nombre: negocio.nombre || '',
      propietario_id: negocio.propietario_id || PROPIETARIO_ID_EJEMPLO,
      whatsapp: negocio.whatsapp || '',
      instagram: negocio.instagram || '',
      direccion: negocio.direccion || '',
      tiktok: negocio.tiktok || '',
      web: negocio.web || '',
      coordenadas: negocio.coordenadas || { lat: 0, lng: 0 },
      foto: negocio.foto || '',
      codigoQr: negocio.codigoQr || '',
      administradores: negocio.administradores || [],
      logo: negocio.logo || '',
      categoria: negocio.categoria || '',
      lugar: negocio.lugar || [],
    });
    setViewMode('details');
  };

  const handleEditNegocio = () => {
    setViewMode('create');
  };

  const handleDeleteNegocio = (id: string | undefined) => {
    if (id) {
      setNegocioToDelete(id);
      setAlertMessage('¿Estás seguro de que quieres eliminar este negocio? Esta acción es irreversible.');
      setShowAlert(true);
    }
  };

  const confirmDelete = async () => {
    if (!negocioToDelete) return;
    try {
      setIsLoading(true);
      await deleteDocument(negociosCollection, negocioToDelete);
      setMessage('Negocio eliminado con éxito.');
      setNegocios(prevNegocios => prevNegocios.filter(neg => neg.id !== negocioToDelete));
      setViewMode('list');
    } catch (err) {
      console.error(err);
      setError('No se pudo eliminar el negocio.');
    } finally {
      setIsLoading(false);
      setNegocioToDelete(undefined);
    }
  };

  const handleBackToList = () => {
    setViewMode('list');
    handleClearSelection();
  };

  const handleAddNegocio = () => {
    handleClearSelection();
    setViewMode('create');
  };

  const handleClearSelection = () => {
    setNegocioSeleccionado(null);
    setNegocioData(initialState);
  };

  const renderNegociosList = () => (
    <div className="list-view-container">
      <h2>Lista de Negocios ({negocios.length})</h2>
      <IonButton expand="block" onClick={handleAddNegocio}>Agregar Nuevo Negocio</IonButton>
      <IonList>
        {negocios.length > 0 ? (
          negocios.map((negocio) => (
            <IonItem key={negocio.id} onClick={() => handleViewNegocio(negocio)}>
              <IonLabel>{negocio.nombre}</IonLabel>
              <IonButton slot="end" onClick={(e) => { e.stopPropagation(); handleViewNegocio(negocio); }}>Ver</IonButton>
            </IonItem>
          ))
        ) : (
          <IonItem>
            <IonLabel>No se encontraron negocios.</IonLabel>
          </IonItem>
        )}
      </IonList>
    </div>
  );

  const renderNegocioForm = () => (
    <IonCard className="form-container">
      <h2>{negocioSeleccionado ? 'Editar Negocio' : 'Agregar Nuevo Negocio'}</h2>
      <form onSubmit={handleSubmit}>
        <IonItem>
          <IonLabel position="floating">Nombre del negocio</IonLabel>
          <IonInput name="nombre" value={negocioData.nombre} onIonChange={handleInputChange} disabled={isLoading} />
        </IonItem>
        <IonItem>
          <IonLabel position="floating">WhatsApp</IonLabel>
          <IonInput name="whatsapp" value={negocioData.whatsapp} onIonChange={handleInputChange} disabled={isLoading} />
        </IonItem>
        <IonItem>
          <IonLabel position="floating">Dirección</IonLabel>
          <IonInput name="direccion" value={negocioData.direccion} onIonChange={handleInputChange} disabled={isLoading} />
        </IonItem>
        <IonItem>
          <IonLabel position="floating">Categoría</IonLabel>
          <IonInput name="categoria" value={negocioData.categoria} onIonChange={handleInputChange} disabled={isLoading} />
        </IonItem>
        <IonItem>
          <IonLabel position="floating">Lugar (ej. Turmero, Maracay)</IonLabel>
          <IonInput
            name="lugar"
            value={negocioData.lugar.join(', ')}
            onIonChange={handleInputChange}
            disabled={isLoading}
          />
        </IonItem>

        <div className="button-group">
          <IonButton type="submit" expand="block" color="primary" disabled={isLoading}>
            {negocioSeleccionado ? 'Guardar Cambios' : 'Crear Negocio'}
          </IonButton>
          <IonButton type="button" onClick={handleBackToList} expand="block" color="medium" disabled={isLoading}>
            Volver
          </IonButton>
        </div>
      </form>
    </IonCard>
  );

  const renderNegocioDetails = () => (
    <IonCard className="details-view-container">
      <h2>{negocioSeleccionado?.nombre}</h2>
      <p><strong>WhatsApp:</strong> {negocioSeleccionado?.whatsapp || 'N/A'}</p>
      <p><strong>Dirección:</strong> {negocioSeleccionado?.direccion || 'N/A'}</p>
      <p><strong>Categoría:</strong> {negocioSeleccionado?.categoria || 'N/A'}</p>
      <p><strong>ID:</strong> {negocioSeleccionado?.id}</p>
      <p><strong>Lugar:</strong> {(negocioSeleccionado?.lugar || []).join(', ') || 'N/A'}</p>
      <p><strong>Coordenadas:</strong> Latitud: {negocioSeleccionado?.coordenadas?.lat || 'N/A'}, Longitud: {negocioSeleccionado?.coordenadas?.lng || 'N/A'}</p>
      <p><strong>Instagram:</strong> {negocioSeleccionado?.instagram || 'N/A'}</p>
      <p><strong>TikTok:</strong> {negocioSeleccionado?.tiktok || 'N/A'}</p>
      <p><strong>Web:</strong> {negocioSeleccionado?.web || 'N/A'}</p>
      <p><strong>Administradores:</strong> {(negocioSeleccionado?.administradores || []).join(', ') || 'N/A'}</p>
      <p><strong>Foto:</strong> <a href={negocioSeleccionado?.foto || '#'} target="_blank" rel="noopener noreferrer">Ver Foto</a></p>
      <p><strong>Logo:</strong> <a href={negocioSeleccionado?.logo || '#'} target="_blank" rel="noopener noreferrer">Ver Logo</a></p>
      <p><strong>Código QR:</strong> <a href={negocioSeleccionado?.codigoQr || '#'} target="_blank" rel="noopener noreferrer">Ver Código QR</a></p>

      <div className="button-group-details">
        <IonButton onClick={handleEditNegocio} color="primary" disabled={isLoading}>
          Editar
        </IonButton>
        <IonButton onClick={() => handleDeleteNegocio(negocioSeleccionado?.id)} color="danger" disabled={isLoading}>
          Eliminar
        </IonButton>
        <IonButton onClick={handleBackToList} color="medium" disabled={isLoading}>
          Volver
        </IonButton>
      </div>
    </IonCard>
  );

  const renderContent = () => {
    switch (viewMode) {
      case 'list':
        return renderNegociosList();
      case 'create':
        return renderNegocioForm();
      case 'details':
        return renderNegocioDetails();
      default:
        return null;
    }
  };

  return (
    <>
      <IonLoading isOpen={isLoading} message="Cargando..." />
      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}
      {renderContent()}
      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header={'Confirmar'}
        message={alertMessage}
        buttons={[
          {
            text: 'Cancelar',
            role: 'cancel',
          },
          {
            text: 'Eliminar',
            handler: () => {
              confirmDelete();
            },
          },
        ]}
      />
    </>
  );
};

export default CreadorNegocios;