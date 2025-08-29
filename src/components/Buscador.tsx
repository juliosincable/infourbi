import React from 'react';
import { IonButton } from '@ionic/react';

const Buscador: React.FC = () => {
  return (
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
  );
};

export default Buscador;