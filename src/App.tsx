import { setupIonicReact } from "@ionic/react";
import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import React, { Suspense } from "react";
import { ThemeProvider } from "./theme/ThemeProvider";
import { AuthProvider } from "./context/AuthProvider";
import {
  home as homeIcon,
  apps as appsIcon,
  person as personIcon,
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

// Componentes Wrappers de Rutas 👈 IMPORTACIONES REALES
import PrivateRoute from "./router/PrivateRoute";
import AnonymousRoute from "./router/AnonymousRoute";

// Rutas Públicas/Privadas (Usando React.lazy para consistencia y code splitting)
const Home = React.lazy(() => import("./pages/Home"));
const Prueba = React.lazy(() => import("./pages/Prueba"));
const PaginaDetalleNegocio = React.lazy(
  () => import("./pages/PaginaDetalleNegocio")
);

// Nuevas Rutas necesarias para protección (ASUMIMOS QUE EXISTEN AHORA)
const Login = React.lazy(() => import("./pages/Login"));
const Profile = React.lazy(() => import("./pages/Profile"));

/* ========================================= */

// Configura Ionic React
setupIonicReact();

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <IonApp>
        <AuthProvider>
          <IonReactRouter>
            <Suspense fallback={<div>Cargando...</div>}>
              <IonRouterOutlet id="main">
                {/* 1. RUTAS ANÓNIMAS (NO TABS) */}
                {/* Solo accesible si el usuario NO está autenticado. Si lo está, redirige a /home. */}
                <AnonymousRoute path="/login" component={Login} exact={true} />

                {/* 2. RUTAS PRIVADAS/PÚBLICAS SIN PESTAÑAS (Ej: Perfil, Detalle) */}
                {/* Solo accesible si el usuario SÍ está autenticado. Si no, redirige a /login. */}
                <PrivateRoute
                  path="/profile"
                  component={Profile}
                  exact={true}
                />
                
                {/* La ruta de detalle puede ser pública */}
                <Route path="/negocio/:id" component={PaginaDetalleNegocio} />

                {/* 3. ESTRUCTURA DE PESTAÑAS (TABS) */}
                <Route path="/:tab(home|prueba)">
                  <IonTabs>
                    <IonRouterOutlet>
                      {/* Rutas con Pestañas: Usamos PrivateRoute para protegerlas */}
                      <PrivateRoute path="/home" component={Home} exact={true} />
                      <PrivateRoute
                        path="/prueba"
                        component={Prueba}
                        exact={true}
                      />
                      
                      {/* Redirección por defecto dentro del contexto de Tabs si se accede a la raíz */}
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

                {/* 4. FALLBACK GENERAL: Si se accede a la raíz */}
                <Route exact path="/" render={() => <Redirect to="/home" />} />

              </IonRouterOutlet>
            </Suspense>
          </IonReactRouter>
        </AuthProvider>
      </IonApp>
    </ThemeProvider>
  );
};

export default App;