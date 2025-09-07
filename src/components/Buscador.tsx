import React from "react";
import { IonButton, IonInput } from "@ionic/react";
import styles from "./Buscador.module.css";

const Buscador: React.FC = () => {
  return (
    <div className="search-container">
      <div className={styles["search-container"]}>
        <label htmlFor="nombre-usuario">Buscar:</label>
        <IonInput
          type="text"
          id="nombre-usuario"
          placeholder="ej. Panadería"
        ></IonInput>
      </div>
      <IonButton color="primary">Buscar</IonButton>
    </div>
  );
};

export default Buscador;
