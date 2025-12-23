import React from 'react';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton } from '@ionic/react';

const Header: React.FC = () => {
  return (
    <IonHeader className="ion-no-border">
      <IonToolbar>
        <IonTitle style={{ fontWeight: 'bold' }}>infoUrbi</IonTitle>
        <IonButtons slot="end">
          {/* Este botón abrirá el menú lateral automáticamente */}
          <IonMenuButton color="primary" />
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  );
};

export default Header;