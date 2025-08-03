import React from 'react'; // Asegúrate de importar React

interface ContainerProps { }

const ExploreContainer: React.FC<ContainerProps> = () => {
  return (
    <>
      {/* Estilos CSS para el cuadrado adaptable y centrado */}
      <style>
        {`
        .yellow-square {
          background-color: yellow; /* Color de fondo amarillo */
          border-radius: 15px; /* Bordes redondeados */
          display: flex; /* Utilizado para centrar cualquier contenido futuro dentro del cuadrado */
          justify-content: center; /* Centra el contenido horizontalmente */
          align-items: center; /* Centra el contenido verticalmente */
          box-sizing: border-box; /* Asegura que el padding y el borde se incluyan en el width/height */

          /* Estilos para móviles (por defecto - mobile-first) */
          width: calc(100% - 40px); /* Ocupa casi todo el ancho, dejando 20px de margen a cada lado */
          height: calc(100% - 40px); /* Ocupa casi todo el alto, dejando 20px de margen arriba y abajo */
          margin: 20px; /* Margen de 20px en todos los lados para crear el "borde" */
        }

        /*
         * Media Query para pantallas más grandes (escritorio/tablet).
         * Los estilos dentro de esta sección se aplicarán cuando el ancho de la pantalla
         * sea igual o mayor a 768px.
         */
        @media (min-width: 768px) {
          .yellow-square {
            width: 600px; /* Ancho fijo para versiones de escritorio */
            height: 400px; /* Alto fijo para versiones de escritorio */
            margin: 20px auto; /* Centra el cuadrado horizontalmente y mantiene margen vertical */
          }
        }
        `}
      </style>
      {/* El div que representa el cuadrado amarillo */}
      <div className="yellow-square">
        {/* No hay texto ni contenido dentro de este div */}
      </div>
    </>
  );
};

export default ExploreContainer;