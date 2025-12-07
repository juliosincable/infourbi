// Archivo: src/pages/Profile.tsx

import React from 'react';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonButton, IonCard, IonCardContent, IonCardHeader, 
  IonCardTitle, IonItem, IonLabel, IonIcon 
} from '@ionic/react';
import { useAuth } from '../context/AuthDefinitions'; 
import { useHistory } from 'react-router-dom';
import { personCircle } from 'ionicons/icons'; 

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
                <>
                    {/* Icono de Avatar Centrado */}
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <IonIcon 
                            icon={personCircle} 
                            style={{ fontSize: '80px', color: '#6c757d' }} 
                        />
                    </div>

                    {/* 🟢 Información del Nombre */}
                    <IonItem lines="none">
                        <IonLabel>
                            <h2>Nombre</h2>
                            {/* Usamos 'nombre' según tu interfaz Usuario */}
                            <p>{currentUser.nombre || 'Nombre no disponible'}</p>
                        </IonLabel>
                    </IonItem>
                    
                    {/* 🟢 Información del Email (Corregido a 'correo' según la interfaz) */}
                    <IonItem lines="none">
                        <IonLabel>
                            <h2>Email</h2>
                            {/* Usamos 'correo' según tu interfaz Usuario */}
                            <p>{currentUser.correo}</p>
                        </IonLabel>
                    </IonItem>
                </>
            ) : (
              <p>No hay información del usuario disponible.</p>
            )}

            <IonButton 
                expand="block" 
                onClick={handleLogout} 
                color="danger" 
                style={{ marginTop: '30px' }}
            >
              Cerrar Sesión
            </IonButton>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Profile;