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
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import {
  Negocio,
  addNegocio,
  updateDocument,
  deleteDocument,
  getDocuments,
  negociosCollection,
} from '../service/database';

const PROPIETARIO_ID_EJEMPLO = "propietario-123";

const Prueba: React.FC = () => {
  const history = useHistory(); // Inicializa el hook de historial
  const [negocios, setNegocios] = useState<Negocio[]>([]);
  const [nombreNegocio, setNombreNegocio] = useState('');
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
      const { data } = await getDocuments(negociosCollection);
      setNegocios(data);
    } catch (err) {
      console.error(err);
      setError('Error al cargar la lista de negocios.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!nombreNegocio.trim()) {
      setMessage('El nombre del negocio no puede estar vacío.');
      return;
    }

    try {
      setIsLoading(true);
      if (negocioSeleccionado) {
        if (negocioSeleccionado.id) {
          await updateDocument(negociosCollection, negocioSeleccionado.id, { nombre: nombreNegocio });
          setNegocioSeleccionado(null);
          setMessage('Negocio actualizado con éxito.');
        }
      } else {
        await addNegocio({ nombre: nombreNegocio, propietario_id: PROPIETARIO_ID_EJEMPLO });
        setMessage('Negocio agregado con éxito.');
      }
      setNombreNegocio('');
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
    setNombreNegocio(negocio.nombre);
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
    setNombreNegocio('');
  };

  const handleSearchNegocio = async () => {
    if (!nombreNegocio.trim()) {
      setMessage('Por favor, ingresa un nombre para buscar.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await getDocuments(negociosCollection, {
        pageSize: 99999,
        orderByField: 'nombre',
      });
      const resultados = data.filter(negocio =>
        negocio.nombre.toLowerCase().includes(nombreNegocio.toLowerCase())
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
          {/* Botón de inicio en la derecha */}
          <IonButtons slot="end">
            <IonButton onClick={goToHome}>
              Inicio
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
          
          <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
            <h2>{negocioSeleccionado ? 'Editar Negocio' : 'Agregar Nuevo Negocio'}</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={nombreNegocio}
                onChange={(e) => setNombreNegocio(e.target.value)}
                placeholder="Nombre del negocio"
                style={{ width: '100%', padding: '10px', marginBottom: '10px', boxSizing: 'border-box' }}
                disabled={isLoading}
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="submit"
                  style={{
                    padding: '10px 15px',
                    backgroundColor: negocioSeleccionado ? '#f39c12' : '#2ecc71',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                  disabled={isLoading}
                >
                  {negocioSeleccionado ? 'Guardar Cambios' : 'Agregar Negocio'}
                </button>
                <button
                  type="button"
                  onClick={handleSearchNegocio}
                  style={{
                    padding: '10px 15px',
                    backgroundColor: '#3498db',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                  disabled={isLoading}
                >
                  Buscar
                </button>
                {negocioSeleccionado && (
                  <button
                    type="button"
                    onClick={handleClearSelection}
                    style={{
                      padding: '10px 15px',
                      backgroundColor: '#95a5a6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                    disabled={isLoading}
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>

          <IonLoading isOpen={isLoading} message="Cargando..." />
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {message && <p style={{ color: 'green' }}>{message}</p>}

          <h2>Lista de Negocios ({negocios.length})</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {negocios.length > 0 ? (
              negocios.map((negocio) => (
                <div
                  key={negocio.id}
                  style={{
                    border: '1px solid #ddd',
                    padding: '15px',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: negocioSeleccionado?.id === negocio.id ? '#ecf0f1' : 'white',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  <div>
                    <p style={{ margin: 0, fontWeight: 'bold' }}>{negocio.nombre}</p>
                    <p style={{ margin: 0, fontSize: '0.9em', color: '#666' }}>ID: {negocio.id}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleSelectNegocio(negocio)}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: '#3498db',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                      disabled={isLoading}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteNegocio(negocio.id)}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: '#e74c3c',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                      disabled={isLoading}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No se encontraron negocios.</p>
            )}
          </div>

          {negocioSeleccionado && (
            <div style={{ marginTop: '20px', border: '1px solid #3498db', padding: '20px', borderRadius: '8px' }}>
              <h2>Detalles del Negocio</h2>
              <p><strong>ID:</strong> {negocioSeleccionado.id}</p>
              <p><strong>Nombre:</strong> {negocioSeleccionado.nombre}</p>
              <p><strong>ID Propietario:</strong> {negocioSeleccionado.propietario_id}</p>
            </div>
          )}
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
