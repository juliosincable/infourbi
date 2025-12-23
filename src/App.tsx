import React from 'react';
import { IonApp, IonRouterOutlet, setupIonicReact, IonSpinner } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect, Switch } from 'react-router-dom';

import { AuthProvider, useAuth } from "./context/AuthProvider"; 
import HomeTabs from './components/HomeTabs'; 
import Login from './pages/Login';
import Register from './pages/Register';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

setupIonicReact();

const AppInternal: React.FC = () => {
    const { isAuthenticated, loading } = useAuth();

    // 1. Si está cargando, retornamos el spinner envuelto en IonApp para que se vea
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
        <IonReactRouter>
            <IonRouterOutlet>
                <Switch>
                    <Route exact path="/login">
                        {isAuthenticated ? <Redirect to="/tabs/home" /> : <Login />}
                    </Route>

                    <Route exact path="/register">
                        {isAuthenticated ? <Redirect to="/tabs/home" /> : <Register />}
                    </Route>

                    <Route path="/tabs">
                        <HomeTabs />
                    </Route>

                    <Route exact path="/">
                        {isAuthenticated ? <Redirect to="/tabs/home" /> : <Redirect to="/login" />}
                    </Route>

                    <Route render={() => <Redirect to="/login" />} />
                </Switch>
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