import { FC } from "react"; 

const Buscador: FC = () => { 
  return (
    <div style={{
      padding: '10px', 
      margin: '16px auto', 
      maxWidth: '600px', 
      display: 'flex', 
      gap: '10px', 
      alignItems: 'center',
      backgroundColor: '#f9f9f9'
    }}>
      <div> 
        <label htmlFor="nombre-usuario">Buscar:</label>
        <input
          type="text"
          id="nombre-usuario"
          placeholder="ej. Panadería"
          style={{ padding: '8px', border: '1px solid #ccc' }}
        />
      </div>
      <button style={{ padding: '8px' }}>Buscar (HTML)</button>
    </div>
  );
};

export default Buscador;