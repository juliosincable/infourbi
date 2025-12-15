// src/App.tsx (VERSIÓN FINAL CON AUTH Y RUTAS PROTEGIDAS - CORRECCIÓN ESLINT/TS)

import React from 'react';
import { 
    IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, IonIcon, 
    IonLabel, IonApp, IonSpinner, IonContent 
} from '@ionic/react'; 
import { Redirect, Route, useHistory, RouteProps, RouteComponentProps } from 'react-router-dom'; // 🛑 Importar RouteProps y RouteComponentProps
import { IonReactRouter } from '@ionic/react-router';

import { logOutOutline, triangle, ellipse, square } from 'ionicons/icons'; 

// 🛑 Importaciones de la lógica de autenticación
import { useAuth } from "./context/AuthDefinitions"; 
import { AuthProvider } from './context/AuthProvider'; 

// Importaciones de las guardias de rutas
import { PrivateRoute } from './router/PrivateRoute'; 

// Importaciones de páginas
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import PaginaDetalleNegocio from './pages/PaginaDetalleNegocio';
import Prueba from './pages/Prueba';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
// ... (otras importaciones CSS) ...
import './theme/variables.scss';

// ====================================================================
// 🛑 DEFINICIONES DE TIPOS PARA ELIMINAR EL ERROR 'any'
// ====================================================================

// 1. Tipo para los props que recibe la página que se renderiza (Home, Login, etc.)
type RouteInnerComponentProps = RouteComponentProps<object>;

// 2. Interfaz que define las propiedades que aceptan nuestras Guardias de Ruta
interface GuardRouteProps extends RouteProps {
    // El componente que se va a renderizar debe aceptar los props de ruta de v5
    component: React.ComponentType<RouteInnerComponentProps>; 
}


// ====================================================================
// A. COMPONENTE DE GUARDIA INVERSA (Solo para Rutas Públicas: Login/Register)
// ====================================================================

// 🛑 CORRECCIÓN: Usamos GuardRouteProps en lugar de 'any'
const PublicOnlyRoute: React.FC<GuardRouteProps> = ({ component: Component, ...rest }) => {
    const { isAuthenticated, loading } = useAuth();

    return (
        <Route
            {...rest}
            // 🛑 Tipamos el argumento props dentro del render
            render={(props: RouteInnerComponentProps) => {
                // Muestra spinner durante la carga inicial de Firebase
                if (loading) {
                    return (
                        <IonContent fullscreen className="ion-padding">
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                <IonSpinner name="crescent" />
                            </div>
                        </IonContent>
                    );
                }

                if (isAuthenticated) {
                    // Si está autenticado, redirige al Home (ruta con tabs)
                    return <Redirect to="/tabs/home" />;
                } else {
                    // Si NO está autenticado, permite ver el componente (Login/Register)
                    return <Component {...props} />;
                }
            }}
        />
    );
};

// ====================================================================
// B. COMPONENTE DE REDIRECCIÓN DE RAÍZ (Controla la primera carga /)
// ====================================================================

// Determina si redirigir a /login o /tabs/home
const AuthRedirectRoute: React.FC = () => {
    const { isAuthenticated, loading } = useAuth();
    
    // Si está cargando, no redirigimos para evitar flashes (el spinner de IonApp podría ser mejor)
    if (loading) return (
         <Route exact path="/" render={() => (
             <IonContent fullscreen className="ion-padding">
                 <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                     <IonSpinner name="crescent" />
                 </div>
             </IonContent>
         )} />
    ); 

    return (
        <Route exact path="/">
            <Redirect to={isAuthenticated ? "/tabs/home" : "/login"} /> 
        </Route>
    );
};

// ====================================================================
// C. COMPONENTE DE LOGOUT (Tu componente original)
// ====================================================================
const MenuLogoutItem: React.FC = () => {
    const { logout } = useAuth();
    const history = useHistory();

    const handleLogout = () => {
        logout()
            .then(() => {
                history.replace('/login'); // Usar replace para evitar volver al tab
            })
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

// ====================================================================
// D. ESTRUCTURA PRINCIPAL DEL APP
// ====================================================================

const App: React.FC = () => (
    <IonApp>
        <IonReactRouter>
            {/* 🛑 Nivel 2: AuthProvider para que toda la APP tenga acceso al estado */}
            <AuthProvider>
                
                {/* 1. RUTAS DE AUTENTICACIÓN (Guardia Inversa) */}
                <PublicOnlyRoute exact path="/login" component={Login} />
                <PublicOnlyRoute exact path="/register" component={Register} />
                
                {/* 2. RUTAS PÚBLICAS SIN TABS (Detalle de Negocio) */}
                <Route path="/negocio/:id" component={PaginaDetalleNegocio} />


                {/* 3. ESTRUCTURA DE PESTAÑAS */}
                <IonTabs>
                    <IonRouterOutlet>
                        {/* 🎯 RUTAS PRIVADAS: Usan PrivateRoute */}
                        <PrivateRoute exact path="/tabs/home" component={Home} />
                        <PrivateRoute exact path="/tabs/profile" component={Profile} />
                        <PrivateRoute exact path="/tabs/prueba" component={Prueba} />
                        
                        {/* Redirección interna dentro de tabs */}
                        <Route exact path="/tabs">
                            <Redirect to="/tabs/home" />
                        </Route>

                        {/* 4. REDIRECCIÓN DE RAÍZ (/) */}
                        <AuthRedirectRoute />

                    </IonRouterOutlet>
                    
                    {/* 5. BARRA DE PESTAÑAS */}
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