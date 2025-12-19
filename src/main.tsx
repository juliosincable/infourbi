import React from 'react';
import { createRoot } from 'react-dom/client';
import { IonApp, IonContent, IonPage, setupIonicReact } from '@ionic/react';
import App from './App'; // Volvemos a importar tu App real

/* CSS estándar de Ionic (Estas sí existen siempre) */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Opcionales de Ionic */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

setupIonicReact();

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);