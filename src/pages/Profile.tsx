// Archivo: src/pages/Profile.tsx

import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonItem, IonLabel } from '@ionic/react';
// ❌ ANTES: import { useAuth } from '../context/Auth';
// ✅ CORRECCIÓN: Ahora importamos useAuth desde el archivo de definiciones.
import { useAuth } from '../context/AuthDefinitions'; 
import { useHistory } from 'react-router-dom';

const Profile: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const history = useHistory();

  const handleLogout = async () => {
    try {
      await logout();
      // Redirige al usuario a la página de login o a la home page después del logout
      history.push('/login');
      console.log('Usuario ha cerrado sesión');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Perfil de Usuario</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Información del Usuario</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            {currentUser ? (
              <IonItem>
                <IonLabel>
                  <h2>Email</h2>
                  <p>{currentUser.email}</p>
                </IonLabel>
              </IonItem>
            ) : (
              <p>No hay información del usuario disponible.</p>
            )}
            <IonButton expand="block" onClick={handleLogout} color="danger" style={{ marginTop: '20px' }}>
              Cerrar Sesión
            </IonButton>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
