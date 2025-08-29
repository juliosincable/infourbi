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
  IonList,
  IonItem,
  IonActionSheet,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import "../theme/variables.css";

import { Negocio } from "../types/types";
import { negociosCollection } from "../service/database";
import { getDocs } from "firebase/firestore";

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
        {/* Sección 1: Selector de ciudad */}
        <h1 style={{ textAlign: 'center', fontWeight: 'bold' }}>{currentCity}</h1>
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <IonButton onClick={() => setShowCityMenu(true)}>
            Seleccionar ciudad
          </IonButton>
        </div>
        <IonActionSheet
          isOpen={showCityMenu}
          onDidDismiss={() => setShowCityMenu(false)}
          header="Selecciona una ciudad"
          buttons={[
            {
              text: 'Turmero',
              handler: () => setCurrentCity('Turmero'),
            },
            {
              text: 'Maracay',
              handler: () => setCurrentCity('Maracay'),
            },
            {
              text: 'Cagua',
              handler: () => setCurrentCity('Cagua'),
            },
            {
              text: 'Cancelar',
              role: 'cancel',
            },
          ]}
        ></IonActionSheet>
        
        {/* Sección 2: Búsqueda (sin funcionalidad) */}
        <div className="home-container">
          <div className="search-container">
            <div className="search-bar">
              <label htmlFor="nombre-usuario">Buscar:</label>
              <input
                type="text"
                id="nombre-usuario"
                placeholder="ej. Panadería"
              />
            </div>
            <IonButton expand="block" color="primary">
              Buscar
            </IonButton>
          </div>
        </div>

        {/* Sección 3: Lista de negocios */}
        <div className="results-container">
          {loading && <p className="ion-text-center">Cargando...</p>}
          {!loading && businesses.length > 0 && (
            <IonList>
              {businesses.map((business) => (
                <IonItem key={business.id}>
                  {business.nombre}
                </IonItem>
              ))}
            </IonList>
          )}
          {!loading && businesses.length === 0 && (
            <p className="ion-text-center">No hay negocios para mostrar.</p>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;