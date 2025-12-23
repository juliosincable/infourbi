import React from 'react';
import { 
  IonApp, 
  IonRouterOutlet, 
  setupIonicReact, 
  IonSpinner, 
  IonHeader, 
  IonToolbar, 
  IonTitle 
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect, Switch } from 'react-router-dom';

import { AuthProvider, useAuth } from "./context/AuthProvider"; 
import HomeTabs from './components/HomeTabs'; 
import Login from './pages/Login';
import Register from './pages/Register';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
/* Tus variables SCSS globales */
import './theme/variables.scss'; 

setupIonicReact();

/**
 * Componente de Barra Superior Global
 * Se le añade estilo 'fixed' para que el Outlet pueda posicionarse debajo.
 */
const TopBar: React.FC = () => (
  <IonHeader className="ion-no-border" style={{ position: 'fixed', top: 0, zIndex: 100 }}>
    <IonToolbar>
      <IonTitle style={{ fontWeight: 'bold' }}>infoUrbi</IonTitle>
    </IonToolbar>
  </IonHeader>
);

const AppInternal: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  // Pantalla de carga inicial
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        background: '#f4f4f4' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <IonSpinner name="crescent" color="primary" />
          <p style={{ color: '#666', marginTop: '10px' }}>Iniciando infoUrbi...</p>
        </div>
      </div>
    );
  }

  return (
    <IonReactRouter>
      {/* 1. Renderizamos la barra si está autenticado */}
      {isAuthenticated && <TopBar />}

      {/* 2. Contenedor principal con margen dinámico basado en SCSS */}
      <div style={{ 
        position: 'absolute',
        top: isAuthenticated ? 'var(--infourbi-topbar-height)' : '0',
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden' // Evita scroll doble
      }}>
        <IonRouterOutlet>
          <Switch>
            <Route exact path="/login">
              {isAuthenticated ? <Redirect to="/tabs/home" /> : <Login />}
            </Route>

            <Route exact path="/register">
              {isAuthenticated ? <Redirect to="/tabs/home" /> : <Register />}
            </Route>

            <Route path="/tabs">
              {isAuthenticated ? <HomeTabs /> : <Redirect to="/login" />}
            </Route>

            <Route exact path="/">
              {isAuthenticated ? <Redirect to="/tabs/home" /> : <Redirect to="/login" />}
            </Route>

            <Route render={() => <Redirect to="/login" />} />
          </Switch>
        </IonRouterOutlet>
      </div>
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