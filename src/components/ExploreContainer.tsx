import React from 'react';

// Importa el único archivo de estilos que se está utilizando.
import '../theme/variables.css';

const ExploreContainer: React.FC = () => {
  return (
    <div className="container">
      <div className="search-container">
        <label htmlFor="nombre-usuario">Buscar:</label>
        <input type="text" id="nombre-usuario" placeholder="ej. Juan Perez" />
      </div>
    </div>
  );
};

export default ExploreContainer;