import React from 'react';
import { IonButton, IonActionSheet } from '@ionic/react';
// 1. Importa el módulo CSS
import styles from './Ciudades.module.scss';

interface CiudadesProps {
  currentCity: string;
  showCityMenu: boolean;
  setShowCityMenu: (value: boolean) => void;
  setCurrentCity: (city: string) => void;
}

const Ciudades: React.FC<CiudadesProps> = ({ currentCity, showCityMenu, setShowCityMenu, setCurrentCity }) => {
  return (
    // INICIO DEL CONTENEDOR CON ESTILOS: Reemplaza <>
    <div className={styles.cityContainer}> 
      
      {/* 2. Usa las clases del módulo */}
      <h1 className={`${styles.centeredText} ${styles.boldText}`}>{currentCity}</h1>
      <div className={`${styles.centeredText} ${styles.marginBottom16}`}>
        <IonButton onClick={() => setShowCityMenu(true)}>
          Seleccionar ciudad
        </IonButton>
      </div>
      <IonActionSheet
        isOpen={showCityMenu}
        onDidDismiss={() => setShowCityMenu(false)}
        header="Selecciona una ciudad"
        buttons={[
          {
            text: "Turmero",
            handler: () => setCurrentCity("Turmero"),
          },
          {
            text: "Maracay",
            handler: () => setCurrentCity("Maracay"),
          },
          {
            text: "Cagua",
            handler: () => setCurrentCity("Cagua"),
          },
          {
            text: "Cancelar",
            role: "cancel",
          },
        ]}
      ></IonActionSheet>
    {/* FIN DEL CONTENEDOR: Reemplaza </> */}
    </div> 
  );
};

export default Ciudades;