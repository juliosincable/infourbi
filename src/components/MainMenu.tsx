import React from 'react';
import { 
  IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonList, IonItem, IonIcon, IonLabel, IonMenuToggle 
} from '@ionic/react';
import { homeOutline, personOutline, logOutOutline } from 'ionicons/icons';
import { useAuth } from "../context/AuthProvider"; // Importamos tu Auth para que "Salir" funcione

const MainMenu: React.FC = () => {
  const { logout } = useAuth(); // Usamos tu función de cerrar sesión

  return (
    <IonMenu contentId="main-content" type="overlay">
      <IonHeader className="ion-no-border">
        <IonToolbar color="light">
          <IonTitle style={{ fontWeight: 'bold' }}>Menú infoUrbi</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent>
        <IonList lines="none">
          <IonMenuToggle autoHide={false}>
            {/* Link a Inicio */}
            <IonItem button routerLink="/tabs/home">
              <IonIcon slot="start" icon={homeOutline} color="primary" />
              <IonLabel>Inicio</IonLabel>
            </IonItem>
            
            {/* Link a Perfil */}
            <IonItem button routerLink="/tabs/perfil">
              <IonIcon slot="start" icon={personOutline} color="primary" />
              <IonLabel>Mi Perfil</IonLabel>
            </IonItem>

            {/* Botón de Salir con lógica real */}
            <IonItem button onClick={() => logout()}>
              <IonIcon slot="start" icon={logOutOutline} color="danger" />
              <IonLabel color="danger">Salir</IonLabel>
            </IonItem>
          </IonMenuToggle>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default MainMenu;