import React from 'react';

interface ContainerProps { }

const ExploreContainer: React.FC<ContainerProps> = () => {
  return (
    <div className="main-square">
      <h2 className="title-text">Maracay</h2>



    <label htmlFor="nombre-usuario">Nombre de usuario:</label>
<input type="text" id="nombre-usuario" placeholder="ej. Juan Perez" />
    </div>
  );
};

export default ExploreContainer;