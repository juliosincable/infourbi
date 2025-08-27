import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonAlert,
  IonLoading,
  IonButton,
  IonItem,
  IonLabel,
  IonInput,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import {
  addDocument,
  updateDocument,
  deleteDocument,
  getDocuments,
  negociosCollection,
} from '../service/database';
import { Negocio } from '../types/types';
import { IonInputCustomEvent } from '@ionic/core';
import { InputChangeEventDetail } from '@ionic/core';

import '../theme/variables.css';

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
};

const Prueba: React.FC = () => {
  const history = useHistory();
  const [negocios, setNegocios] = useState<Negocio[]>([]);
  const [negocioData, setNegocioData] = useState<Omit<Negocio, 'id'>>(initialState);
  const [negocioSeleccionado, setNegocioSeleccionado] = useState<Negocio | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [negocioToDelete, setNegocioToDelete] = useState<string | undefined>(undefined);

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
      } else {
        // Asegura que el valor se maneje siempre como una cadena para los campos de texto
        (newData as any)[name] = typeof value === 'string' || typeof value === 'number' ? String(value) : '';
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
          setNegocioSeleccionado(null);
          setMessage('Negocio actualizado con éxito.');
        }
      } else {
        await addDocument(negociosCollection, negocioData);
        setMessage('Negocio agregado con éxito.');
      }
      setNegocioData(initialState);
      fetchNegocios();
    } catch (err) {
      console.error(err);
      setError('No se pudo guardar el negocio.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectNegocio = (negocio: Negocio) => {
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
    });
  };

  const handleDeleteNegocio = (id: string | undefined) => {
    if (id) {
      setNegocioToDelete(id);
      setAlertMessage('¿Estás seguro de que quieres eliminar este negocio?');
      setShowAlert(true);
    }
  };

  const confirmDelete = async () => {
    if (!negocioToDelete) return;
    try {
      setIsLoading(true);
      await deleteDocument(negociosCollection, negocioToDelete);
      setMessage('Negocio eliminado con éxito.');
      fetchNegocios();
    } catch (err) {
      console.error(err);
      setError('No se pudo eliminar el negocio.');
    } finally {
      setIsLoading(false);
      setNegocioToDelete(undefined);
    }
  };

  const handleClearSelection = () => {
    setNegocioSeleccionado(null);
    setNegocioData(initialState);
  };

  const handleSearchNegocio = async () => {
    if (!negocioData.nombre.trim()) {
      setMessage('Por favor, ingresa un nombre para buscar.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await getDocuments<Negocio>(negociosCollection, {
        pageSize: 99999,
        orderByField: 'nombre',
      });
      const resultados = data.filter(negocio =>
        negocio.nombre.toLowerCase().includes(negocioData.nombre.toLowerCase())
      );
      setNegocios(resultados);
      setMessage(`Se encontraron ${resultados.length} negocios.`);
    } catch (err) {
      console.error(err);
      setError('No se pudo realizar la búsqueda.');
    } finally {
      setIsLoading(false);
    }
  };

  const goToHome = () => {
    history.push('/home');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Gestión de Negocios</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={goToHome}>
              Inicio
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="page-container">
          <div className="form-container">
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
                <IonLabel position="floating">Instagram (opcional)</IonLabel>
                <IonInput name="instagram" value={negocioData.instagram} onIonChange={handleInputChange} disabled={isLoading} />
              </IonItem>
              <IonItem>
                <IonLabel position="floating">Dirección</IonLabel>
                <IonInput name="direccion" value={negocioData.direccion} onIonChange={handleInputChange} disabled={isLoading} />
              </IonItem>
              <IonItem>
                <IonLabel position="floating">TikTok (opcional)</IonLabel>
                <IonInput name="tiktok" value={negocioData.tiktok} onIonChange={handleInputChange} disabled={isLoading} />
              </IonItem>
              <IonItem>
                <IonLabel position="floating">Web (opcional)</IonLabel>
                <IonInput name="web" value={negocioData.web} onIonChange={handleInputChange} disabled={isLoading} />
              </IonItem>
              <IonItem>
                <IonLabel position="floating">URL de la Foto</IonLabel>
                <IonInput name="foto" value={negocioData.foto} onIonChange={handleInputChange} disabled={isLoading} />
              </IonItem>
              <IonItem>
                <IonLabel position="floating">URL del Código QR</IonLabel>
                <IonInput name="codigoQr" value={negocioData.codigoQr} onIonChange={handleInputChange} disabled={isLoading} />
              </IonItem>
              <IonItem>
                <IonLabel position="floating">URL del Logo</IonLabel>
                <IonInput name="logo" value={negocioData.logo} onIonChange={handleInputChange} disabled={isLoading} />
              </IonItem>
              <IonItem>
                <IonLabel position="floating">Categoría</IonLabel>
                <IonInput name="categoria" value={negocioData.categoria} onIonChange={handleInputChange} disabled={isLoading} />
              </IonItem>
              <IonItem>
                <IonLabel position="floating">Administradores (separar por comas)</IonLabel>
                <IonInput
                  name="administradores"
                  value={negocioData.administradores?.join(', ') || ''}
                  onIonChange={handleInputChange}
                  disabled={isLoading}
                />
              </IonItem>
              
              <div className="form-group-inline">
                <IonItem>
                  <IonLabel position="floating">Latitud</IonLabel>
                  <IonInput
                    name="coordenadas.lat"
                    value={negocioData.coordenadas?.lat}
                    onIonChange={handleInputChange}
                    disabled={isLoading}
                  />
                </IonItem>
                <IonItem>
                  <IonLabel position="floating">Longitud</IonLabel>
                  <IonInput
                    name="coordenadas.lng"
                    value={negocioData.coordenadas?.lng}
                    onIonChange={handleInputChange}
                    disabled={isLoading}
                  />
                </IonItem>
              </div>

              <div className="button-group">
                <IonButton type="submit" expand="block" color={negocioSeleccionado ? "primary" : "secondary"}>
                  {negocioSeleccionado ? 'Guardar Cambios' : 'Agregar Negocio'}
                </IonButton>
                <IonButton type="button" onClick={handleSearchNegocio} expand="block" color="tertiary">
                  Buscar
                </IonButton>
                {negocioSeleccionado && (
                  <IonButton type="button" onClick={handleClearSelection} expand="block" color="danger">
                    Cancelar
                  </IonButton>
                )}
              </div>
            </form>
          </div>
          <IonLoading isOpen={isLoading} message="Cargando..." />
          {error && <p className="error-message">{error}</p>}
          {message && <p className="success-message">{message}</p>}
          <h2>Lista de Negocios ({negocios.length})</h2>
          <div className="negocios-list">
            {negocios.length > 0 ? (
              negocios.map((negocio) => (
                <div
                  key={negocio.id}
                  className={`negocio-card ${negocioSeleccionado?.id === negocio.id ? 'selected-card' : ''}`}
                >
                  <div className="negocio-header">
                    <h3>{negocio.nombre}</h3>
                    <div className="button-group">
                      <IonButton onClick={() => handleSelectNegocio(negocio)} size="small" color="primary">
                        Editar
                      </IonButton>
                      <IonButton onClick={() => handleDeleteNegocio(negocio.id)} size="small" color="danger">
                        Eliminar
                      </IonButton>
                    </div>
                  </div>
                  <p><strong>ID:</strong> {negocio.id}</p>
                  <p><strong>WhatsApp:</strong> {negocio.whatsapp || 'N/A'}</p>
                  <p><strong>Dirección:</strong> {negocio.direccion || 'N/A'}</p>
                  <p><strong>Coordenadas:</strong> Latitud: {negocio.coordenadas?.lat || 'N/A'}, Longitud: {negocio.coordenadas?.lng || 'N/A'}</p>
                  <p><strong>Categoría:</strong> {negocio.categoria || 'N/A'}</p>
                  <p><strong>Instagram:</strong> {negocio.instagram || 'N/A'}</p>
                  <p><strong>TikTok:</strong> {negocio.tiktok || 'N/A'}</p>
                  <p><strong>Web:</strong> {negocio.web || 'N/A'}</p>
                  <p><strong>Administradores:</strong> {(negocio.administradores || []).join(', ') || 'N/A'}</p>
                  <p><strong>Foto:</strong> <a href={negocio.foto || '#'} target="_blank" rel="noopener noreferrer">Ver Foto</a></p>
                  <p><strong>Logo:</strong> <a href={negocio.logo || '#'} target="_blank" rel="noopener noreferrer">Ver Logo</a></p>
                  <p><strong>Código QR:</strong> <a href={negocio.codigoQr || '#'} target="_blank" rel="noopener noreferrer">Ver Código QR</a></p>
                </div>
              ))
            ) : (
              <p>No se encontraron negocios.</p>
            )}
          </div>
        </div>
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header={'Confirmar'}
          message={alertMessage}
          buttons={[
            {
              text: 'Cancelar',
              role: 'cancel',
              cssClass: 'secondary',
            },
            {
              text: 'Eliminar',
              handler: () => {
                confirmDelete();
              },
            },
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default Prueba;