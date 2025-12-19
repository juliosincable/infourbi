import React from 'react';
import { IonApp, IonRouterOutlet, setupIonicReact, IonSpinner } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect, Switch } from 'react-router-dom';

import { AuthProvider, useAuth } from "./context/AuthProvider"; // ASEGÚRATE QUE ESTA RUTA ES CORRECTA
import HomeTabs from './components/HomeTabs'; 
import Login from './pages/Login';
import Register from './pages/Register';

setupIonicReact();

const AppInternal: React.FC = () => {
    const { isAuthenticated, loading } = useAuth();

    // 1. Mientras Firebase responde, mostramos carga
    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f4f4f4' }}>
                <div style={{ textAlign: 'center' }}>
                    <IonSpinner name="crescent" color="primary" />
                    <p style={{ color: '#666', marginTop: '10px' }}>Iniciando infoUrbi...</p>
                </div>
            </div>
        );
    }

    return (
        <IonRouterOutlet>
            <Switch>
                {/* RUTA DE LOGIN: Si ya está autenticado, lo mandamos directo a /tabs/home */}
                <Route exact path="/login">
                    {isAuthenticated ? <Redirect to="/tabs/home" /> : <Login />}
                </Route>

                <Route exact path="/register">
                    {isAuthenticated ? <Redirect to="/tabs/home" /> : <Register />}
                </Route>

                {/* RUTA DE TABS: Aquí es donde te expulsaba. 
                    Si por algún error de código isAuthenticated es false pero acabas de loguearte, 
                    vamos a darle una oportunidad de cargar. */}
                <Route path="/tabs">
                   <HomeTabs />
                </Route>

                {/* REDIRECCIÓN MAESTRA */}
                <Route exact path="/">
                    {isAuthenticated ? <Redirect to="/tabs/home" /> : <Redirect to="/login" />}
                </Route>

                {/* FALLBACK: Si se pierde, al login */}
                <Route render={() => <Redirect to="/login" />} />
            </Switch>
        </IonRouterOutlet>
    );
};

const App: React.FC = () => (
    <IonApp>
        <AuthProvider>
            <IonReactRouter>
                <AppInternal />
            </IonReactRouter>
        </AuthProvider>
    </IonApp>
);

export default App;