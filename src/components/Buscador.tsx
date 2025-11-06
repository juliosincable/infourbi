import React from "react";
import { IonButton, IonInput } from "@ionic/react";
// CORRECCIÓN CRÍTICA: Importación de 'styles' ahora en minúsculas
import styles from "./Buscador.module.scss";

const Buscador: React.FC = () => {
  return (
    // Aplicamos el estilo del recuadro aquí
    <div className={styles.searchBox}>
      {/* Tu div interno sigue usando la clase interna definida en el CSS Module */}
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
