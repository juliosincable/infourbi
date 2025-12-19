import React from 'react';
import { 
  IonTabs, 
  IonTabBar, 
  IonTabButton, 
  IonIcon, 
  IonLabel, 
  IonRouterOutlet, 
  IonPage, 
  IonContent, 
  IonHeader, 
  IonToolbar, 
  IonTitle 
} from '@ionic/react';
import { home, person, search } from 'ionicons/icons';
import { Route, Redirect, Switch } from 'react-router-dom';

// Esta es la pantalla que verás al entrar
const Tab1: React.FC = () => (
  <IonPage>
    <IonHeader>
      <IonToolbar color="primary">
        <IonTitle>infoUrbi - Inicio</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent className="ion-padding">
      <h1>¡Lo lograste!</h1>
      <p>Bienvenido al panel principal de infoUrbi.</p>
    </IonContent>
  </IonPage>
);

const HomeTabs: React.FC = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Switch>
          {/* Definimos la ruta exacta para el home */}
          <Route exact path="/tabs/home" component={Tab1} />
          
          {/* Si alguien entra a /tabs a secas, lo mandamos a /tabs/home */}
          <Route exact path="/tabs">
            <Redirect to="/tabs/home" />
          </Route>
        </Switch>
      </IonRouterOutlet>

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
    </IonTabs>
  );
};

export default HomeTabs;