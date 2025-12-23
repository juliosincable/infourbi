import React, { FC } from "react"; 
import { 
  IonSearchbar, 
  IonButton, 
  IonItem, 
  IonLabel, 
  IonPage, 
  IonContent 
} from '@ionic/react';

// IMPORTAMOS EL HEADER GLOBAL
import Header from '../components/Header';

const Buscador: FC = () => { 
  return (
    <IonPage>
      {/* INYECTAMOS EL HEADER AQUÍ */}
      <Header />

      <IonContent className="ion-padding">
        <div style={{
          padding: '10px', 
          margin: '16px auto', 
          maxWidth: '600px',
          backgroundColor: '#f9f9f9',
          borderRadius: '8px'
        }}>
          <IonItem lines="none" style={{ '--background': 'transparent' }}>
            <IonLabel position="stacked" style={{ marginBottom: '10px' }}>
              Buscar en infoUrbi:
            </IonLabel>
            <IonSearchbar 
              placeholder="ej. Panadería, Farmacia..." 
              animated={true}
              showClearButton="always"
            />
          </IonItem>
          <div style={{ padding: '0 16px' }}>
            <IonButton expand="block" size="default">
              Buscar (Firestore)
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Buscador;