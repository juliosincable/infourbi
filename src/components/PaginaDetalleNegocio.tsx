import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonBackButton,
  IonButtons,
  IonSpinner,
  IonIcon,
} from "@ionic/react";
import { personCircleOutline } from "ionicons/icons";
import { Negocio } from "../types/types";
import { doc, getDoc } from 'firebase/firestore';
import { db } from "../service/firebaseConfig";
import styles from "./PaginaDetalleNegocio.module.css";

const PaginaDetalleNegocio: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [negocio, setNegocio] = useState<Negocio | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerNegocio = async () => {
      if (!id) {
        setCargando(false);
        return;
      }
      try {
        const docRef = doc(db, "negocios", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setNegocio(docSnap.data() as Negocio);
        } else {
          console.log("No se encontró el documento!");
          setNegocio(null);
        }
      } catch (e) {
        console.error("Error al obtener el documento: ", e);
      } finally {
        setCargando(false);
      }
    };

    obtenerNegocio();
  }, [id]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Detalles del Negocio</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {cargando && (
          <div className={styles.contenedorCentrado}>
            <IonSpinner name="dots" />
          </div>
        )}
        {!cargando && negocio && (
          <div>
            <div className={styles.subheader}></div>
            <div className={styles.iconContainer}>
              <IonIcon icon={personCircleOutline} />
            </div>
            <div className={styles.businessInfo}>
              <h1>{negocio.nombre}</h1>
              <p>
                <strong>Propietario:</strong> {negocio.propietario_id}
              </p>
              <p>
                <strong>WhatsApp:</strong> {negocio.whatsapp}
              </p>
              <p>
                <strong>Dirección:</strong> {negocio.direccion}
              </p>
              <p>
                <strong>Categoría:</strong> {negocio.categoria}
              </p>
              <p>
                <strong>Lugares:</strong> {negocio.lugar.join(", ")}
              </p>
              <p>
                <strong>Administradores:</strong>{" "}
                {negocio.administradores.join(", ")}
              </p>
            </div>
          </div>
        )}
        {!cargando && !negocio && (
          <div className={styles.contenedorCentrado}>
            <p>
              No se encontraron datos para este negocio.
            </p>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default PaginaDetalleNegocio;