import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonBackButton, IonButtons, IonSpinner } from '@ionic/react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../service/firebaseConfig'; // Asegúrate de que esta ruta sea correcta

interface Negocio {
  id: string;
  nombre: string;
  // Agrega aquí el resto de las propiedades de tu negocio
}

const PaginaDetalleNegocio: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [negocio, setNegocio] = useState<Negocio | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerNegocio = async () => {
      if (!id) {
        setCargando(false);
        return;
      }
      try {
        const docRef = doc(db, "negocios", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // El documento existe, obtén los datos
          setNegocio({ id: docSnap.id, ...docSnap.data() } as Negocio);
        } else {
          // El documento no existe
          console.log("No se encontró el documento!");
          setNegocio(null);
        }
      } catch (e) {
        console.error("Error al obtener el documento: ", e);
      } finally {
        setCargando(false);
      }
    };

    obtenerNegocio();
  }, [id]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>{negocio ? negocio.nombre : 'Detalles del Negocio'}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {cargando && <IonSpinner name="dots" />}
        {!cargando && negocio && (
          <div>
            <h1>{negocio.nombre}</h1>
            {/* Aquí puedes mostrar el resto de la información del negocio */}
            <p>ID: {negocio.id}</p>
          </div>
        )}
        {!cargando && !negocio && (
          <p className="ion-text-center">No se encontraron datos para este negocio.</p>
        )}
      </IonContent>
    </IonPage>
  );
};

export default PaginaDetalleNegocio;