import React from 'react';
import { 
  IonTabs, IonTabBar, IonTabButton, IonIcon, 
  IonLabel, IonRouterOutlet, IonPage, IonContent,
  IonSearchbar, IonButton, IonItem
} from '@ionic/react';
import { home, person, search } from 'ionicons/icons';
import { Route, Redirect, Switch } from 'react-router-dom';

// IMPORTAMOS TU NUEVA PÁGINA
import Profile from '../pages/Profile'; 

// --- COMPONENTE BUSCADOR (Segunda Ruta) ---
const Buscador: React.FC = () => (
  <IonPage>
    <IonContent className="ion-padding">
      <div style={{ padding: '10px', margin: '16px auto', maxWidth: '600px', backgroundColor: '#f9f9f9', borderRadius: '12px' }}>
        <IonItem lines="none" style={{ '--background': 'transparent' }}>
          <IonLabel position="stacked" style={{ marginBottom: '10px' }}>Buscar en infoUrbi:</IonLabel>
          <IonSearchbar placeholder="ej. Panadería, Farmacia..." animated={true} />
        </IonItem>
        <div style={{ padding: '0 16px 16px 16px' }}>
          <IonButton expand="block" shape="round">Buscar</IonButton>
        </div>
      </div>
    </IonContent>
  </IonPage>
);

// --- PANTALLA DE INICIO (Primera Ruta) ---
const Tab1: React.FC = () => (
  <IonPage>
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
          <Route exact path="/tabs/home" component={Tab1} />
          <Route exact path="/tabs/search" component={Buscador} />
          
          {/* AHORA USAMOS TU COMPONENTE PROFILE AQUÍ */}
          <Route exact path="/tabs/perfil" component={Profile} />

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