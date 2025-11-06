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
import { personCircleSharp } from "ionicons/icons";
import { Negocio } from "../types/types";
import { getDocumentById } from "../service/database";
import { negociosCollection } from "../service/database";
import styles from "./PaginaDetalleNegocio.module.scss";

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
        const negocioData = await getDocumentById(negociosCollection, id);
        setNegocio(negocioData);
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
          <div className={styles.mainContainer}>
            <div className={styles.subheader}></div>
            <div className={styles.iconContainer}>
              <IonIcon icon={personCircleSharp} />
            </div>
            <div className={styles.businessInfo}>
              {/* 1. Nombre */}
              <h1>{negocio.nombre}</h1>
              {/* 2. Dirección */}
              <p>
                <strong>Dirección:</strong> {negocio.direccion}
              </p>
              {/* 3. WhatsApp */}
              <p>
                <strong>WhatsApp:</strong> {negocio.whatsapp}
              </p>
              {/* 4. Instagram (condicional) */}
              {negocio.instagram && (
                <p>
                  <strong>Instagram:</strong> {negocio.instagram}
                </p>
              )}
              {/* 5. TikTok (condicional) */}
              {negocio.tiktok && (
                <p>
                  <strong>TikTok:</strong> {negocio.tiktok}
                </p>
              )}
              {/* 6. Web (condicional) */}
              {negocio.web && (
                <p>
                  <strong>Web:</strong> {negocio.web}
                </p>
              )}
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