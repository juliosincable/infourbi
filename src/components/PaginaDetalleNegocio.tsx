
import React from 'react';
import { useParams } from 'react-router-dom';
import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonBackButton, IonButtons } from '@ionic/react';

const PaginaDetalleNegocio: React.FC = () => {
  // Obtiene el 'id' del negocio de la URL (ej. "/negocio/123")
  const { id } = useParams<{ id: string }>();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Detalles del Negocio</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h1>Detalles del Negocio: {id}</h1>
        <p>Aquí es donde cargarías y mostrarías la información del negocio con el ID: **{id}**</p>
      </IonContent>
    </IonPage>
  );
};

export default PaginaDetalleNegocio;