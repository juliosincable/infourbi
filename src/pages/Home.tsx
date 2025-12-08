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
    IonText,
    IonIcon, 
    IonMenuToggle, // Necesario para abrir el menú
} from "@ionic/react";
import { useHistory } from "react-router-dom";

import { menu as menuIcon } from "ionicons/icons"; // Ícono del menú

import "../theme/variables.scss";
import styles from "./Home.module.scss";

// Importaciones de tipos y Firebase
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
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadAllBusinesses = async () => {
            setLoading(true);
            setError(null);
            try {
                const querySnapshot = await getDocs(negociosCollection);
                const allBusinesses = querySnapshot.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id,
                })) as Negocio[];
                setBusinesses(allBusinesses);
            } catch (err: unknown) {
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
                    
                    {/* El slot de la izquierda queda vacío */}
                    <IonButtons slot="start" />
                    
                    <IonTitle>infoUrbi</IonTitle>
                    
                    {/* Botón de menú en el slot derecho (end) */}
                    <IonButtons slot="end">
                        {/* CLAVE: IonMenuToggle llama al menú "main" y autoHide={false} garantiza que funcione en todos los modos */}
                        <IonMenuToggle menu="main" autoHide={false}> 
                            <IonButton>
                                <IonIcon slot="icon-only" icon={menuIcon} /> 
                            </IonButton>
                        </IonMenuToggle>
                    </IonButtons>

                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonGrid fixed className="ion-text-center">
                    <IonRow className="ion-justify-content-center ion-align-items-center">
                        <IonCol size="12" className={styles['col-limit']}> 
                            <div className={styles['home-container']}>
                                
                                {error && (
                                    <IonText color="danger">
                                        <h2>Error de Conexión</h2>
                                        <p>{error}</p>
                                        <p>Verifica las reglas de seguridad de Firestore en tu consola de Firebase.</p>
                                    </IonText>
                                )}

                                <Ciudades />
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