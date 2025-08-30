// src/pages/Prueba.tsx

import React from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
} from '@ionic/react';
import CreadorNegocios from '../components/CreadorNegocios';
// Importación del nuevo componente CreadorUbicaciones
import CreadorUbicaciones from '../components/CreadorUbicaciones';
import '../theme/variables.css';

const Prueba: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Gestión de Negocios</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="prueba-container">
          {/* El componente CreadorNegocios se mantiene */}
          <CreadorNegocios />

          {/* Se reemplaza CreadorPaises por el nuevo CreadorUbicaciones */}
          <CreadorUbicaciones />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Prueba;