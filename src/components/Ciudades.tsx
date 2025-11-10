import React, { useState, useEffect } from 'react';
import styles from './Ciudades.module.scss';

const Ciudades: React.FC = () => {
  // Estado para almacenar la ciudad seleccionada
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  // 1. Al montarse, revisar localStorage para obtener la ciudad guardada
  useEffect(() => {
    const cityFromStorage = localStorage.getItem('selectedCity');
    if (cityFromStorage) {
      setSelectedCity(cityFromStorage);
    }
  }, []); // El array vacío asegura que esto se ejecute solo una vez, al montar el componente

  // 5. Función para manejar el cambio de ciudad en el menú
  const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const city = event.target.value;
    if (city) {
      setSelectedCity(city);
      localStorage.setItem('selectedCity', city); // Guardar en localStorage
    }
  };

  return (
    <div className={`${styles.cityContainer} ${styles.centeredText}`}>
      {/* 3. Si hay una ciudad guardada, mostrarla */}
      {selectedCity ? (
        <h1 className={styles.boldText}>Ciudad {selectedCity}</h1>
      ) : (
        // 2. Si no hay ciudad, mostrar un texto indicativo
        <div className={styles.marginBottom16}>
          <strong>Escoger ciudad</strong>
        </div>
      )}

      {/* 4. Menú dropdown para seleccionar la ciudad */}
      <select 
        value={selectedCity || ""} 
        onChange={handleCityChange}
      >
        {/* Opción por defecto que actúa como placeholder */}
        {!selectedCity && <option value="" disabled>Selecciona una ciudad</option>}
        
        {/* Opciones de ciudades */}
        <option value="Turmero">Turmero</option>
        <option value="Maracay">Maracay</option>
        <option value="Cagua">Cagua</option>
      </select>
    </div>
  );
};

export default Ciudades;
