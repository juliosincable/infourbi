import React from 'react';
import { IonButton, IonActionSheet } from '@ionic/react';

interface CiudadesProps {
  currentCity: string;
  showCityMenu: boolean;
  setShowCityMenu: (value: boolean) => void;
  setCurrentCity: (city: string) => void;
}

const Ciudades: React.FC<CiudadesProps> = ({ currentCity, showCityMenu, setShowCityMenu, setCurrentCity }) => {
  return (
    <>
      <h1 style={{ textAlign: "center", fontWeight: "bold" }}>{currentCity}</h1>
      <div style={{ textAlign: "center", marginBottom: "16px" }}>
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
    </>
  );
};

export default Ciudades;