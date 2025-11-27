import React, { useState, useEffect } from "react";
import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonGrid,
  IonRow,
  IonCol,
  IonText 
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import "../theme/variables.scss";
import styles from "./Home.module.scss";

// Importaciones de tipos y Firebase RESTAURADAS
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
  const [error, setError] = useState<string | null>(null); // Estado para el error

  useEffect(() => {
    // Lee la coleccion 'negocios' y muestra todos los nombres
    const loadAllBusinesses = async () => {
      setLoading(true);
      setError(null); // Resetea el error
      try {
        console.log("Intentando obtener negocios de Firebase...");
        const querySnapshot = await getDocs(negociosCollection);
        const allBusinesses = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })) as Negocio[];
        
        console.log(`Negocios cargados: ${allBusinesses.length}`);
        setBusinesses(allBusinesses);
      } catch (err: unknown) {
        console.error("⛔️ ERROR FATAL DE FIREBASE AL OBTENER NEGOCIOS:", err);
        let errorMessage = "Ocurrió un error desconocido.";
        if (err instanceof Error) {
          errorMessage = err.message;
        } else if (typeof err === 'string') {
          errorMessage = err;
        }
        setError(`Error de Firebase: ${errorMessage}`);
        setBusinesses([]);
      } finally {
        setLoading(false);
        console.log("Proceso de carga de negocios finalizado.");
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
          <IonTitle>infoUrbi</IonTitle>
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
                
                {/* Muestra el error si existe */}
                {error && (
                  <IonText color="danger">
                    <h2>Error de Conexión</h2>
                    <p>{error}</p>
                    <p>Verifica las reglas de seguridad de Firestore en tu consola de Firebase.</p>
                  </IonText>
                )}

                <Ciudades />
                
                {/* 💥 PRUEBA DE AISLAMIENTO 2/3: Descomentamos Buscador */}
                <Buscador />
                
                {/* <Listado businesses={businesses} loading={loading} /> */}
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Home;