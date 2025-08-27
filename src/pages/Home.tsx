import React from "react";
import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import "../theme/variables.css";

const Home = () => {
  const history = useHistory();

  const goToPrueba = () => {
    history.push("/prueba");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>infourbis</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={goToPrueba}>Prueba</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <div className="home-container">
          <div className="search-container">
            <div className="search-bar">
              <label htmlFor="nombre-usuario">Buscar:</label>
              <input type="text" id="nombre-usuario" placeholder="ej. Juan Perez" />
            </div>
            <IonButton expand="block" color="primary">
              Buscar
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;