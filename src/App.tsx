// src/App.tsx (VERSIÓN CORREGIDA FINAL)

import React from 'react';
import { 
    IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, IonIcon, 
    IonLabel, IonBadge, IonApp // 🎯 AÑADIR IonApp AQUÍ
} from '@ionic/react'; 
import { Redirect, Route, useHistory } from 'react-router-dom'; 
import { IonReactRouter } from '@ionic/react-router';

import { ellipse, square, triangle, logOutOutline, home, person, cog } from 'ionicons/icons'; // 🎯 Añadir íconos básicos

// Importación de AuthProvider y useAuth 
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
    // 🎯 CRÍTICO: Envuelve todo en IonApp (faltaba en tu código de App.tsx)
    <IonApp>
        <IonReactRouter>
            <AuthProvider>
                
                {/* 1. RUTAS SIN BARRA DE PESTAÑAS (Login, Register, Detalle Negocio) */}
                <Route exact path="/login" component={Login} />
                <Route exact path="/register" component={Register} />
                <Route path="/negocio/:id" component={PaginaDetalleNegocio} />


                {/* 2. ESTRUCTURA DE PESTAÑAS */}
                <IonTabs>
                    <IonRouterOutlet>
                        {/* 🎯 CORRECCIÓN CLAVE: Todas las rutas de las pestañas deben usar el prefijo /tabs/ */}
                        <Route exact path="/tabs/home" component={Home} />
                        <Route exact path="/tabs/profile" component={Profile} />
                        <Route exact path="/tabs/prueba" component={Prueba} />

                        {/* Redirección dentro de tabs: /tabs -> /tabs/home */}
                        <Route exact path="/tabs">
                            <Redirect to="/tabs/home" />
                        </Route>

                        {/* Redirección por defecto: / -> /tabs/home (o /login si es la página de inicio) */}
                        <Route exact path="/">
                             {/* Puedes cambiar '/tabs/home' por '/login' si quieres que inicie en el login */}
                            <Redirect to="/tabs/home" /> 
                        </Route>
                    </IonRouterOutlet>
                    
                    {/* 3. BARRA DE PESTAÑAS (DEBE APUNTAR A LAS NUEVAS RUTAS /tabs/...) */}
                    <IonTabBar slot="bottom">
                        <IonTabButton tab="home" href="/tabs/home">
                            <IonIcon icon={triangle} />
                            <IonLabel>Home</IonLabel>
                        </IonTabButton>
                        
                        <IonTabButton tab="profile" href="/tabs/profile">
                            <IonIcon icon={ellipse} />
                            <IonLabel>Perfil</IonLabel>
                        </IonTabButton>
                        
                        <IonTabButton tab="prueba" href="/tabs/prueba">
                            <IonIcon icon={square} />
                            <IonLabel>Prueba</IonLabel>
                        </IonTabButton>
                        
                        <MenuLogoutItem />
                    </IonTabBar>
                </IonTabs>

            </AuthProvider>
        </IonReactRouter>
    </IonApp>
);

export default App;