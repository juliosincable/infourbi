import { setupIonicReact } from "@ionic/react";
// Importaciones clave de React Router v5 (Route y Redirect son correctas)
import { Redirect, Route } from "react-router-dom";
import {
    IonApp,
    IonIcon,
    IonLabel,
    IonRouterOutlet,
    IonTabBar,
    IonTabButton,
    IonTabs,
    // Componentes del menú lateral
    IonMenu,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonMenuToggle,
    IonItem,
} from "@ionic/react";
// IonReactRouter utiliza internamente React Router.
import { IonReactRouter } from "@ionic/react-router";
// Restauramos Suspense
import React, { Suspense } from "react";
import { ThemeProvider } from "./theme/ThemeProvider";
import { AuthProvider } from "./context/Auth"; // Asumo que es el proveedor
import {
    home as homeIcon,
    apps as appsIcon,
    person as personIcon,
} from "ionicons/icons";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";
/* ... (Omisión de estilos CSS) ... */
import "./theme/variables.scss";

/* ========================================= */
/* IMPORTACIÓN DE PÁGINAS Y WRAPPERS DE RUTA */
/* ========================================= */

// Componentes Wrappers de Rutas
import { PrivateRoute } from "./router/PrivateRoute";
import { AnonymousRoute } from "./router/AnonymousRoute";

// Componente LoadingGate importado
import LoadingGate from "./router/LoadingGate"; 

// Rutas (Usando React.lazy)
const Home = React.lazy(() => import("./pages/Home"));
const Prueba = React.lazy(() => import("./pages/Prueba"));
const PaginaDetalleNegocio = React.lazy(
    () => import("./pages/PaginaDetalleNegocio")
);
const Login = React.lazy(() => import("./pages/Login"));
const Profile = React.lazy(() => import("./pages/Profile"));

/* ========================================= */

// Configura Ionic React
setupIonicReact();

const App: React.FC = () => {
    return (
        <ThemeProvider>
            <IonApp>
                
                {/* MENÚ LATERAL: Dentro de IonApp */}
                <IonMenu contentId="main" menuId="main" side="end"> 
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>Menú</IonTitle>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent>
                        <IonList>
                            <IonMenuToggle autoHide={false}>
                                <IonItem routerLink="/home" routerDirection="none">
                                    <IonIcon slot="start" icon={homeIcon} />
                                    <IonLabel>Inicio</IonLabel>
                                </IonItem>
                                <IonItem routerLink="/prueba" routerDirection="none">
                                    <IonIcon slot="start" icon={appsIcon} />
                                    <IonLabel>Página de Prueba</IonLabel>
                                </IonItem>
                                <IonItem routerLink="/profile" routerDirection="none">
                                    <IonIcon slot="start" icon={personIcon} />
                                    <IonLabel>Mi Perfil</IonLabel>
                                </IonItem>
                            </IonMenuToggle>
                        </IonList>
                    </IonContent>
                </IonMenu>
                
                {/* 🛑 CORRECCIÓN: INVERSIÓN DEL ORDEN */}
                <AuthProvider> {/* 1. El proveedor debe ir PRIMERO */}
                    <LoadingGate> {/* 2. El componente que USA el hook debe ir DENTRO */}
                        <IonReactRouter>
                            <Suspense fallback={<div>Cargando...</div>}>
                                <IonRouterOutlet id="main">
                                    {/* 1. RUTAS ANÓNIMAS (Ej: Login) */}
                                    <AnonymousRoute path="/login" component={Login} exact={true} />

                                    {/* 2. RUTAS PRIVADAS/PÚBLICAS SIN PESTAÑAS */}
                                    <PrivateRoute path="/profile" component={Profile} exact={true} />
                                    <Route path="/negocio/:id" component={PaginaDetalleNegocio} />

                                    {/* 3. ESTRUCTURA DE PESTAÑAS (TABS) */}
                                    <Route path="/:tab(home|prueba)">
                                        <IonTabs>
                                            <IonRouterOutlet>
                                                <PrivateRoute path="/home" component={Home} exact={true} />
                                                <PrivateRoute path="/prueba" component={Prueba} exact={true} />
                                                <Route exact path="/" render={() => <Redirect to="/home" />} />
                                            </IonRouterOutlet>

                                            {/* Barra de pestañas en la parte inferior */}
                                            <IonTabBar slot="bottom">
                                                <IonTabButton tab="home" href="/home">
                                                    <IonIcon icon={homeIcon} /><IonLabel>Home</IonLabel>
                                                </IonTabButton>
                                                <IonTabButton tab="prueba" href="/prueba">
                                                    <IonIcon icon={appsIcon} /><IonLabel>Prueba</IonLabel>
                                                </IonTabButton>
                                                <IonTabButton tab="profile" href="/profile">
                                                    <IonIcon icon={personIcon} /><IonLabel>Perfil</IonLabel>
                                                </IonTabButton>
                                            </IonTabBar>
                                        </IonTabs>
                                    </Route>

                                    {/* 4. FALLBACK GENERAL */}
                                    <Route exact path="/" render={() => <Redirect to="/home" />} />

                                </IonRouterOutlet>
                            </Suspense>
                        </IonReactRouter>
                    </LoadingGate>
                </AuthProvider>
            </IonApp>
        </ThemeProvider>
    );
};

export default App;