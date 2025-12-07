import { setupIonicReact } from "@ionic/react";
// Importaciones clave de React Router v5
import { Redirect, Route } from "react-router-dom";
import {
    IonApp,
    IonIcon,
    IonLabel,
    IonRouterOutlet,
    IonTabBar,
    IonTabButton,
    IonTabs,
    // Componentes del Menú Lateral
    IonMenu,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonMenuToggle,
    IonItem,
    IonButtons, // Añadido para el botón de menú
} from "@ionic/react";
// IonReactRouter utiliza internamente React Router.
import { IonReactRouter } from "@ionic/react-router";
import React, { Suspense } from "react";
import { ThemeProvider } from "./theme/ThemeProvider";
import { AuthProvider } from "./context/Auth";
import {
    home as homeIcon,
    apps as appsIcon,
    person as personIcon,
    menu as menuIcon, // Icono de menú
} from "ionicons/icons";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.scss";

/* ========================================= */
/* IMPORTACIÓN DE PÁGINAS Y WRAPPERS DE RUTA */
/* ========================================= */

// Componentes Wrappers de Rutas (Asumen sintaxis v5 internamente)
import { PrivateRoute } from "./router/PrivateRoute";
import { AnonymousRoute } from "./router/AnonymousRoute";

// Componente LoadingGate importado e implementado como wrapper
import LoadingGate from "./router/LoadingGate";

// Rutas Públicas/Privadas (Usando React.lazy para consistencia y code splitting)
const Home = React.lazy(() => import("./pages/Home"));
const Prueba = React.lazy(() => import("./pages/Prueba"));
const PaginaDetalleNegocio = React.lazy(
    () => import("./pages/PaginaDetalleNegocio")
);

// Nuevas Rutas necesarias para protección
const Login = React.lazy(() => import("./pages/Login"));
const Profile = React.lazy(() => import("./pages/Profile"));

/* ========================================= */

// Configura Ionic React
setupIonicReact();

const App: React.FC = () => {
    return (
        <ThemeProvider>
            <IonApp>
                {/* MENÚ DESPLEGABLE LATERAL (IonMenu) */}
                <IonMenu contentId="main" side="end">
                    <IonHeader>
                        <IonToolbar color="primary">
                            <IonTitle>Menú de Navegación</IonTitle>
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

                <LoadingGate>
                    <AuthProvider>
                        <IonReactRouter>
                            <Suspense fallback={<div>Cargando...</div>}>
                                <IonRouterOutlet id="main">
                                    {/* 1. RUTAS ANÓNIMAS (NO TABS) */}
                                    <AnonymousRoute
                                        path="/login"
                                        component={Login}
                                        exact={true}
                                    />

                                    {/* 2. RUTAS PRIVADAS/PÚBLICAS SIN PESTAÑAS */}
                                    <PrivateRoute
                                        path="/profile"
                                        component={Profile}
                                        exact={true}
                                    />

                                    {/* Ruta de detalle pública */}
                                    <PrivateRoute path="/negocio/:id" component={PaginaDetalleNegocio} />

                                    {/* 3. ESTRUCTURA DE PESTAÑAS (TABS) */}
                                    <Route path="/:tab(home|prueba)">
                                        <IonTabs>
                                            <IonRouterOutlet>
                                                {/* Rutas con Pestañas: Usamos PrivateRoute con sintaxis v5 */}
                                                <PrivateRoute
                                                    path="/home"
                                                    component={Home}
                                                    exact={true}
                                                />
                                                <PrivateRoute
                                                    path="/prueba"
                                                    component={Prueba}
                                                    exact={true}
                                                />

                                                {/* Redirección por defecto dentro del contexto de Tabs. */}
                                                <Route
                                                    exact
                                                    path="/"
                                                    render={() => <Redirect to="/home" />}
                                                />
                                            </IonRouterOutlet>

                                            {/* Barra de pestañas en la parte inferior */}
                                            <IonTabBar slot="bottom">
                                                <IonTabButton tab="home" href="/home">
                                                    <IonIcon icon={homeIcon} />
                                                    <IonLabel>Home</IonLabel>
                                                </IonTabButton>

                                                <IonTabButton tab="prueba" href="/prueba">
                                                    <IonIcon icon={appsIcon} />
                                                    <IonLabel>Prueba</IonLabel>
                                                </IonTabButton>

                                                {/* Enlazar la pestaña de perfil a la ruta fuera de Tabs */}
                                                <IonTabButton tab="profile" href="/profile">
                                                    <IonIcon icon={personIcon} />
                                                    <IonLabel>Perfil</IonLabel>
                                                </IonTabButton>
                                            </IonTabBar>
                                        </IonTabs>
                                    </Route>

                                    {/* 4. FALLBACK GENERAL: Si se accede a la raíz. */}
                                    <Route
                                        exact
                                        path="/"
                                        render={() => <Redirect to="/home" />}
                                    />
                                </IonRouterOutlet>
                            </Suspense>
                        </IonReactRouter>
                    </AuthProvider>
                </LoadingGate>
            </IonApp>
        </ThemeProvider>
    );
};

export default App;