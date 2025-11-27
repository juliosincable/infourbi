import { FC, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  // Para ordenar si es necesario: orderBy,
  // Para limitar resultados: limit
} from "firebase/firestore";
// Asegúrate de que 'db' se importe correctamente desde tu archivo de configuración de Firebase
import { db } from "../service/firebaseConfig"; // 🚨 ¡IMPORTANTE! Reemplaza esto con la ruta correcta a tu configuración de Firebase

// Define el tipo de dato que esperas de Firestore
interface Negocio {
  id: string;
  nombre: string;
  // Agrega más campos si es necesario
}

const Buscador: FC = () => {
  // 1. Estado para almacenar el texto de búsqueda
  const [terminoBusqueda, setTerminoBusqueda] = useState<string>("");
  // 2. Estado para almacenar los resultados
  const [resultados, setResultados] = useState<Negocio[]>([]);
  // 3. Estado para manejar la carga y los errores
  const [cargando, setCargando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Realiza la consulta a Firestore.
   */
  const buscarEnFirestore = async (termino: string) => {
    // Si el término está vacío, no busques
    if (!termino.trim()) {
      setResultados([]);
      return;
    }

    setCargando(true);
    setError(null);
    setResultados([]); // Limpiar resultados anteriores

    try {
      // 1. Referencia a la colección
      const negociosRef = collection(db, "negocios");

      // 2. Crear la consulta (Búsqueda de prefijo)
      const q = query(
        negociosRef,
        where("nombre", ">=", termino.trim()),
        where("nombre", "<=", termino.trim() + "\uf8ff")
      );

      // 3. Ejecutar la consulta
      const querySnapshot = await getDocs(q);

      // 4. Mapear los resultados
      const negociosEncontrados: Negocio[] = [];
      querySnapshot.forEach((doc) => {
        negociosEncontrados.push({
          id: doc.id,
          // Convertir el documento a la interfaz Negocio
          ...doc.data() as Omit<Negocio, 'id'>,
        });
      });

      // 🚀 AÑADIDO: Muestra los resultados en la consola del navegador
      console.log(`✅ Resultados de Firestore para "${termino.trim()}":`, negociosEncontrados);

      setResultados(negociosEncontrados);
    } catch (err) {
      console.error("❌ Error al buscar documentos en Firestore:", err);
      setError("Ocurrió un error al realizar la búsqueda. Inténtalo de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  /**
   * Manejador del evento de clic en el botón de búsqueda.
   */
  const handleBuscar = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevenir el comportamiento predeterminado si estuviera dentro de un <form>
    buscarEnFirestore(terminoBusqueda);
  };

  // Puedes opcionalmente agregar un manejador para la tecla Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      buscarEnFirestore(terminoBusqueda);
    }
  };

  return (
    <div
      style={{
        padding: "10px",
        border: "1px solid #ccc",
        margin: "16px auto",
        maxWidth: "600px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <label htmlFor="nombre-usuario">Buscar Negocio:</label>
        <input
          type="text"
          id="nombre-usuario"
          placeholder="ej. Panadería"
          style={{ padding: "8px", border: "1px solid #ccc", flexGrow: 1 }}
          value={terminoBusqueda}
          onChange={(e) => setTerminoBusqueda(e.target.value)} // Actualiza el estado al escribir
          onKeyDown={handleKeyDown} // Para buscar con Enter
        />
        <button
          onClick={handleBuscar} // Llama a la función de búsqueda
          disabled={cargando} // Deshabilita el botón mientras carga
          style={{ padding: "8px", backgroundColor: cargando ? '#ccc' : '#4CAF50', color: 'white', border: 'none', cursor: cargando ? 'not-allowed' : 'pointer' }}
        >
          {cargando ? "Buscando..." : "Buscar en Firestore"}
        </button>
      </div>

      {/* Sección para mostrar los resultados */}
      <hr style={{ width: '100%', border: '0', borderTop: '1px solid #eee' }} />

      <div style={{ minHeight: '100px', padding: '10px', border: '1px solid #eee', backgroundColor: 'white' }}>
        <h3 style={{ marginTop: 0 }}>Resultados:</h3>

        {error && <p style={{ color: 'red' }}>Error: {error}</p>}

        {!cargando && resultados.length === 0 && terminoBusqueda.trim() && (
          <p>No se encontraron negocios con el nombre "{terminoBusqueda.trim()}".</p>
        )}

        {!cargando && resultados.length > 0 && (
          <ul>
            {resultados.map((negocio) => (
              <li key={negocio.id} style={{ marginBottom: '5px' }}>
                **{negocio.nombre}** (ID: {negocio.id})
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Buscador;