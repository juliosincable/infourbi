// Archivo: ./src/pages/Profile.tsx

import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton } from '@ionic/react';
import React from 'react';
// 👈 ¡ESTA ES LA LÍNEA CRÍTICA QUE DEBES CAMBIAR!
// Debe importar desde AuthContext, no desde AuthProvider.
import { useAuth } from '../context/AuthContext'; 

const Profile: React.FC = () => {
  const { logout, currentUser } = useAuth(); 

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Perfil Privado</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h1>Perfil de Usuario</h1>
        <p>Esta es una ruta privada. Solo visible si estás autenticado.</p>
        {currentUser && <p>Bienvenido: **{currentUser.email}**</p>}
        <IonButton expand="full" color="danger" onClick={logout}>
          Cerrar Sesión
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Profile;