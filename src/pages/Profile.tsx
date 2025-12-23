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

import Header from '../components/Header'; 
import { useAuth } from '../context/AuthProvider'; 
import { useHistory } from 'react-router-dom';
import { personCircle } from 'ionicons/icons'; 

const Profile: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const history = useHistory();

  const handleLogout = async () => {
    try {
      await logout();
      history.replace('/login'); 
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <IonPage>
      {/* 1. Asegúrate de que Header esté aquí, fuera del Content */}
      <Header />

      {/* 2. IMPORTANTE: quitamos 'fullscreen' si lo tuviera para que no tape el header */}
      <IonContent className="ion-padding">
        
        <div style={{ marginTop: '8px' }}>
          <IonCard mode="ios" style={{ boxShadow: 'none', border: '1px solid #e0e0e0' }}>
            <IonCardHeader>
              <IonCardTitle style={{ textAlign: 'center', fontWeight: 'bold' }}>
                Mi Perfil
              </IonCardTitle>
            </IonCardHeader>
            
            <IonCardContent>
              {currentUser ? (
                <>
                  <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <IonIcon 
                      icon={personCircle} 
                      style={{ fontSize: '100px', color: '#d1d1d1' }} 
                    />
                  </div>

                  <IonItem lines="full">
                    <IonLabel>
                      <h2 style={{ fontWeight: 'bold', color: '#666' }}>Nombre</h2>
                      <p style={{ fontSize: '1.1rem', color: '#000' }}>
                        {currentUser.nombre || 'Usuario de infoUrbi'}
                      </p>
                    </IonLabel>
                  </IonItem>
                  
                  <IonItem lines="none">
                    <IonLabel>
                      <h2 style={{ fontWeight: 'bold', color: '#666' }}>Correo Electrónico</h2>
                      <p style={{ fontSize: '1.1rem', color: '#000' }}>{currentUser.email}</p>
                    </IonLabel>
                  </IonItem>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <p>Cargando datos de usuario...</p>
                </div>
              )}

              <IonButton 
                expand="block" 
                onClick={handleLogout} 
                color="danger" 
                shape="round"
                style={{ marginTop: '40px', fontWeight: 'bold' }}
              >
                Cerrar Sesión
              </IonButton>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Profile;