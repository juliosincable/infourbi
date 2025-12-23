import React from 'react';
import { IonApp, IonRouterOutlet, setupIonicReact, IonSpinner } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect, Switch } from 'react-router-dom';

import { AuthProvider, useAuth } from "./context/AuthProvider"; 
import MainMenu from './components/MainMenu'; 
import HomeTabs from './components/HomeTabs'; 
import Login from './pages/Login';
import Register from './pages/Register';

/* Estilos base de Ionic */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import './theme/variables.scss'; 

setupIonicReact();

const AppInternal: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <IonSpinner name="crescent" color="primary" />
      </div>
    );
  }

  return (
    <IonReactRouter>
      {/* El menú ahora se importa como componente externo */}
      {isAuthenticated && <MainMenu />}

      {/* Eliminamos el Switch interno para que IonRouterOutlet maneje la pila de páginas */}
      <IonRouterOutlet id="main-content">
        <Route exact path="/login">
          {isAuthenticated ? <Redirect to="/tabs/home" /> : <Login />}
        </Route>
        
        <Route exact path="/register">
          {isAuthenticated ? <Redirect to="/tabs/home" /> : <Register />}
        </Route>

        {/* Esta ruta carga HomeTabs, que es donde debe vivir el footer y la navegación interna */}
        <Route path="/tabs">
          {isAuthenticated ? <HomeTabs /> : <Redirect to="/login" />}
        </Route>

        <Route exact path="/">
          <Redirect to={isAuthenticated ? "/tabs/home" : "/login"} />
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  );
};

const App: React.FC = () => (
  <IonApp>
    <AuthProvider>
      <AppInternal />
    </AuthProvider>
  </IonApp>
);

export default App;