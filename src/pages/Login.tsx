import React from 'react';
import { 
  IonContent, 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle 
} from '@ionic/react';
// Importamos el formulario que ya arreglamos
import LoginForm from '../components/LoginForm';

const Login: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Bienvenido a infoUrbi</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent className="ion-padding">
        {/* AQUÍ ES DONDE APARECERÁ EL FORMULARIO */}
        <LoginForm />
      </IonContent>
    </IonPage>
  );
};

export default Login;