import React, { useState, useEffect } from "react";
import {
    IonContent,
    IonPage,
    IonGrid,
    IonRow,
    IonCol,
    IonText,
} from "@ionic/react";

import styles from "./Home.module.scss";

// 1. IMPORTA TU COMPONENTE HEADER EXTERNO
import Header from "../components/Header"; 

import { Negocio } from "../types/types"; 
import { negociosCollection } from "../service/database";
import { getDocs } from "firebase/firestore";
import Listado from "../components/Listado";

const Home = () => {
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
                if (err instanceof Error) errorMessage = err.message;
                setError(`Error de Firebase: ${errorMessage}`);
                setBusinesses([]);
            } finally {
                setLoading(false);
            }
        };
        loadAllBusinesses();
    }, []);

    return (
        <IonPage>
            {/* 2. COLOCA EL HEADER AQUÍ: Dentro de IonPage pero fuera de IonContent */}
            <Header />

            <IonContent>
                <IonGrid fixed className="ion-text-center">
                    <IonRow className="ion-justify-content-center ion-align-items-center">
                        <IonCol size="12" className={styles['col-limit']}> 
                            <div className={styles['home-container']}>
                                {error && (
                                    <IonText color="danger">
                                        <h2>Error de Conexión</h2>
                                        <p>{error}</p>
                                    </IonText>
                                )}
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