import React from "react";
import { IonList, IonItem } from "@ionic/react";
import { Negocio } from "../types/types";
// CAMBIO CRÍTICO: 'l' minúscula para la importación
import styles from './Listado.module.scss'; 

interface ListadoProps {
  businesses: Negocio[];
  loading: boolean;
}

const Listado: React.FC<ListadoProps> = ({ businesses, loading }) => {
  return (
    // Aplicación de la clase del módulo
    <div className={styles.listContainer}> 
      {loading && <p className="ion-text-center">Cargando...</p>}
      {!loading && businesses.length > 0 && (
        <IonList>
          {businesses.map((business) => (
            <IonItem
              key={business.id}
              routerLink={`/negocio/${business.id}`}
            >
              {business.nombre}
            </IonItem>
          ))}
        </IonList>
      )}
      {!loading && businesses.length === 0 && (
        <p className="ion-text-center">No hay negocios para mostrar.</p>
      )}
    </div>
  );
};

export default Listado;
