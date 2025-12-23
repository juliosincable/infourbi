import React, { FC } from "react"; 
import { IonSearchbar, IonButton, IonItem, IonLabel } from '@ionic/react';

const Buscador: FC = () => { 
  return (
    <div style={{
      padding: '10px', 
      margin: '16px auto', 
      maxWidth: '600px',
      backgroundColor: '#f9f9f9',
      borderRadius: '8px'
    }}>
      <IonItem lines="none" style={{ '--background': 'transparent' }}>
        <IonLabel position="stacked">Buscar en infoUrbi:</IonLabel>
        <IonSearchbar 
          placeholder="ej. Panadería, Farmacia..." 
          animated={true}
          showClearButton="always"
        />
      </IonItem>
      <div style={{ padding: '0 16px' }}>
        <IonButton expand="block" size="small">
          Buscar (Firestore)
        </IonButton>
      </div>
    </div>
  );
};

export default Buscador;