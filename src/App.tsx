import { setupIonicReact } from '@ionic/react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, IonSplitPane } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

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
import './theme/variables.css';

/* Importa tus páginas aquí */
import Home from './pages/Home';
import Prueba from './pages/Prueba';
import PaginaDetalleNegocio from './components/PaginaDetalleNegocio'; // Importa la nueva página

// Configura Ionic React
setupIonicReact();

const App: React.FC = () => {
  return (
    <IonApp className="ion-app-light">
      <IonReactRouter>
        <IonSplitPane contentId="main">
          {/* Si tienes un componente Menu, asegúrate de importarlo en esta ubicación o eliminar este componente. */}
          <IonRouterOutlet id="main">
            <Route path="/home" component={Home} exact={true} />
            <Route path="/prueba" component={Prueba} exact={true} />
            <Route path="/negocio/:id" component={PaginaDetalleNegocio} />
            <Route exact path="/" render={() => <Redirect to="/home" />} />
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;