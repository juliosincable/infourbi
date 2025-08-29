import React from 'react';
import { IonList, IonItem } from '@ionic/react';
import { Negocio } from "../types/types";

interface ListadoProps {
  businesses: Negocio[];
  loading: boolean;
}

const Listado: React.FC<ListadoProps> = ({ businesses, loading }) => {
  return (
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
  );
};

export default Listado;