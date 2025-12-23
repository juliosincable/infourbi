import React from 'react';
import { 
  IonTabs, 
  IonRouterOutlet, 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonButtons, 
  IonMenuButton 
} from '@ionic/react';
import { Route, Redirect } from 'react-router-dom';

import Footer from './Footer';
import MainMenu from './MainMenu';

import Profile from '../pages/Profile'; 
import Home from '../pages/Home'; 
import Buscador from '../pages/Buscador'; 

const HomeTabs: React.FC = () => {
  return (
    <>
      <MainMenu />
      {/* 1. Usamos un IonPage base para toda la sección de tabs */}
      <IonPage id="main-content">
        
        {/* 2. El Header debe estar AQUÍ, con slot="fixed" si es necesario, 
               pero en esta estructura debería verse siempre */}
        <IonHeader>
          <IonToolbar color="primary">
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>infoUrbi</IonTitle>
          </IonToolbar>
        </IonHeader>

        {/* 3. Las Tabs ocupan el resto del espacio visible */}
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/tabs/home" component={Home} />
            <Route exact path="/tabs/search" component={Buscador} />
            <Route exact path="/tabs/perfil" component={Profile} />
            
            <Route exact path="/tabs">
              <Redirect to="/tabs/home" />
            </Route>
          </IonRouterOutlet>

          <Footer />
        </IonTabs>
      </IonPage>
    </>
  );
};

export default HomeTabs;