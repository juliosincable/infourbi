import React from 'react';
import { 
  IonPage, 
  IonContent, 
  IonButton, 
  IonCard, 
  IonCardContent, 
  IonCardHeader, 
  IonCardTitle, 
  IonItem, 
  IonLabel, 
  IonIcon 
} from '@ionic/react';

// --- CAMBIO AQUÍ: Importar desde AuthProvider, NO desde AuthDefinitions ---
import { useAuth } from '../context/AuthProvider'; 

import { useHistory } from 'react-router-dom';
import { personCircle } from 'ionicons/icons'; 

const Profile: React.FC = () => {
  // Ahora currentUser y logout vendrán del contexto real de Firebase
  const { currentUser, logout } = useAuth();
  const history = useHistory();

  const handleLogout = async () => {
    try {
      await logout();
      // El estado cambiará a isAuthenticated: false y App.tsx hará el resto
      history.push('/login');
      console.log('Usuario ha cerrado sesión en infoUrbi');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <IonCard mode="ios">
          <IonCardHeader>
            <IonCardTitle style={{ textAlign: 'center' }}>Mi Perfil</IonCardTitle>
          </IonCardHeader>
          
          <IonCardContent>
            {currentUser ? (
                <>
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <IonIcon 
                            icon={personCircle} 
                            style={{ fontSize: '90px', color: '#a2a2a2' }} 
                        />
                    </div>

                    <IonItem lines="full">
                        <IonLabel>
                            <h2 style={{ fontWeight: 'bold' }}>Nombre</h2>
                            <p>{currentUser.nombre || 'Sin nombre configurado'}</p>
                        </IonLabel>
                    </IonItem>
                    
                    <IonItem lines="none">
                        <IonLabel>
                            <h2 style={{ fontWeight: 'bold' }}>Correo Electrónico</h2>
                            <p>{currentUser.email}</p>
                        </IonLabel>
                    </IonItem>
                </>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <p>Cargando información del usuario...</p>
              </div>
            )}

            <IonButton 
                expand="block" 
                onClick={handleLogout} 
                color="danger" 
                shape="round"
                style={{ marginTop: '40px' }}
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