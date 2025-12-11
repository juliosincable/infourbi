// src/App.tsx (CÓDIGO COMPLETO Y FINAL SIN ERRORES DE COMPILACIÓN)

import React from 'react';
import { 
    IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, IonIcon, 
    IonLabel, IonBadge 
} from '@ionic/react'; // <-- SOLO COMPONENTES DE IONIC
// ******* CORRECCIÓN FINAL TS2305: Route y Redirect vienen de react-router-dom *******
import { Redirect, Route, useHistory } from 'react-router-dom'; 
import { IonReactRouter } from '@ionic/react-router';

import { ellipse, square, triangle, logOutOutline } from 'ionicons/icons';

// Importación de AuthProvider y useAuth (Ruta ya corregida)
import { AuthProvider, useAuth } from "./context"; 

// Importaciones de páginas
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import PaginaDetalleNegocio from './pages/PaginaDetalleNegocio';
import Prueba from './pages/Prueba';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
/* Theme variables */
import './theme/variables.scss';


// Componente que muestra el ícono de logout en la barra de pestañas
const MenuLogoutItem: React.FC = () => {
    const { logout } = useAuth();
    const history = useHistory();

    const handleLogout = () => {
        logout()
            .then(() => {
                history.push('/login'); 
            })
            // Tipado corregido
            .catch((error: Error) => { 
                console.error("Error al cerrar sesión:", error.message);
            });
    };

    return (
        <IonTabButton tab="logout" onClick={handleLogout} href="/login">
            <IonIcon icon={logOutOutline} />
            <IonLabel>Salir</IonLabel>
        </IonTabButton>
    );
};


const App: React.FC = () => (
    <IonReactRouter>
        <AuthProvider>
            <IonTabs>
                <IonRouterOutlet>
                    <Route exact path="/home">
                        <Home />
                    </Route>
                    <Route exact path="/login">
                        <Login />
                    </Route>
                    <Route exact path="/register">
                        <Register />
                    </Route>
                    <Route exact path="/profile">
                        <Profile />
                    </Route>
                    <Route exact path="/negocio/:id">
                        <PaginaDetalleNegocio />
                    </Route>
                    <Route exact path="/prueba">
                        <Prueba />
                    </Route>
                    <Route exact path="/">
                        <Redirect to="/home" />
                    </Route>
                </IonRouterOutlet>
                <IonTabBar slot="bottom">
                    <IonTabButton tab="home" href="/home">
                        <IonIcon icon={triangle} />
                        <IonLabel>Home</IonLabel>
                    </IonTabButton>
                    <IonTabButton tab="profile" href="/profile">
                        <IonIcon icon={ellipse} />
                        <IonLabel>Perfil</IonLabel>
                    </IonTabButton>
                    <IonTabButton tab="prueba" href="/prueba">
                        <IonIcon icon={square} />
                        <IonLabel>Prueba</IonLabel>
                    </IonTabButton>
                    <MenuLogoutItem />
                </IonTabBar>
            </IonTabs>
        </AuthProvider>
    </IonReactRouter>
);

export default App;