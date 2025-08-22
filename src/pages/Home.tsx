import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons, // Importa IonButtons
  IonButton // Importa IonButton
} from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import { useHistory } from 'react-router-dom'; // Importa el hook useHistory

const Home: React.FC = () => {
  const history = useHistory(); // Inicializa el hook de historial

  // Función para navegar a la página de prueba
  const goToPrueba = () => {
    history.push('/prueba');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>infourbi</IonTitle>
          {/* Contenedor para los botones al final (derecha) del toolbar */}
          <IonButtons slot="end">
            {/* Botón que al ser clickeado llama a la función de navegación */}
            <IonButton onClick={goToPrueba}>
              Prueba
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Blank</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer />
      </IonContent>
    </IonPage>
  );
};

export default Home;
