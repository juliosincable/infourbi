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
import CreadorUbicaciones from '../components/CreadorUbicaciones';
import '../theme/variables.css';

// 1. Importa el módulo CSS
import styles from './Prueba.module.css';

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
        {/* 2. Asigna la clase usando la sintaxis de módulos */}
        <div className={styles.pruebaContainer}>
          <CreadorNegocios />
          <CreadorUbicaciones />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Prueba;
