// src/pages/Home.tsx

import React, { useState, useEffect } from "react";
import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonGrid,       // <-- Importa IonGrid
  IonRow,        // <-- Importa IonRow
  IonCol,        // <-- Importa IonCol
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import "../theme/variables.css";
import styles from "./Home.module.css";

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

  // Nuevo efecto para cargar la ciudad desde localStorage al iniciar la app
  useEffect(() => {
    const storedCity = localStorage.getItem("selectedCity");
    if (storedCity) {
      setCurrentCity(storedCity);
    }
  }, []);

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

  // Función para manejar el cambio de ciudad y guardarla en localStorage
  const handleSetCity = (city: string) => {
    setCurrentCity(city);
    localStorage.setItem("selectedCity", city);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>infourbi</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={goToPrueba}>Administrar</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonGrid fixed className="ion-text-center">
          <IonRow className="ion-justify-content-center ion-align-items-center">
            <IonCol size="12">
              <div className={styles['home-container']}>
                <Ciudades
                  currentCity={currentCity}
                  showCityMenu={showCityMenu}
                  setShowCityMenu={setShowCityMenu}
                  setCurrentCity={handleSetCity}
                />
                <Buscador />
                <Listado businesses={businesses} loading={loading} />
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Home;