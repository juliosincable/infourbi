import React, { useState, useEffect } from "react";
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

import { Negocio } from "../types/types";
import { negociosCollection } from "../service/database";
import { getDocs } from "firebase/firestore";

// Importa los nuevos componentes
import Ciudades from "../components/Ciudades";
import Buscador from "../components/Buscador";
import Listado from "../components/Listado";

const Home = () => {
  const history = useHistory();
  const [businesses, setBusinesses] = useState<Negocio[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCityMenu, setShowCityMenu] = useState(false);
  const [currentCity, setCurrentCity] = useState("Selecciona una ciudad");

  useEffect(() => {
    // Lee la coleccion 'negocios' y muestra todos los nombres
    const loadAllBusinesses = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(negociosCollection);
        const allBusinesses = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })) as Negocio[];
        setBusinesses(allBusinesses);
      } catch (error) {
        console.error("Error al obtener negocios:", error);
        setBusinesses([]);
      } finally {
        setLoading(false);
      }
    };
    loadAllBusinesses();
  }, []);

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
          {/* Componente para la selección de ciudad */}
          <Ciudades
            currentCity={currentCity}
            showCityMenu={showCityMenu}
            setShowCityMenu={setShowCityMenu}
            setCurrentCity={setCurrentCity}
          />
          
          {/* Componente del buscador */}
          <Buscador />

          {/* Componente del listado de negocios */}
          <Listado businesses={businesses} loading={loading} />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;