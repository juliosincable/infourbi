// Archivo: ai_service.js
import { GoogleGenAI } from '@google/genai';

// El script lee la clave desde la variable de PowerShell
const ai = new GoogleGenAI({});

async function obtenerRespuesta() {
  try {
    const prompt = "¿Cuál es la capital de Australia y qué modelo de IA está procesando esta solicitud?";
    console.log(`Enviando solicitud: "${prompt}"`);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    console.log("--- Respuesta de la API ---");
    console.log(response.text);

  } catch (error) {
    console.error("❌ Error. ¿Clave API correcta?", error.message);
  }
}

obtenerRespuesta();