import React from 'react';
import { IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/react';
import { home, person, search } from 'ionicons/icons';

const Footer: React.FC = () => {
  return (
    <IonTabBar slot="bottom">
      <IonTabButton tab="home" href="/tabs/home">
        <IonIcon icon={home} />
        <IonLabel>Inicio</IonLabel>
      </IonTabButton>

      <IonTabButton tab="search" href="/tabs/search">
        <IonIcon icon={search} />
        <IonLabel>Buscar</IonLabel>
      </IonTabButton>

      <IonTabButton tab="perfil" href="/tabs/perfil">
        <IonIcon icon={person} />
        <IonLabel>Perfil</IonLabel>
      </IonTabButton>
    </IonTabBar>
  );
};

export default Footer;