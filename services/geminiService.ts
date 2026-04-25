import { GoogleGenAI } from "@google/genai";

export const sendMessageToAI = async (message: string): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.warn("API Key not found in environment variables.");
      return "Error: API Key no configurada.";
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Using the specific model requested in the original code, or falling back to a supported one
    const model = 'gemini-2.5-flash-preview-09-2025';

    const response = await ai.models.generateContent({
      model: model,
      contents: `Eres un asistente escolar Peepos en Perú, experto en gestión educativa, SIAGIE y normas del MINEDU. Responde de forma breve, profesional y útil a: "${message}".`
    });

    return response.text || "Lo siento, no pude generar una respuesta.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Lo siento, hubo un problema de conexión con la IA. Por favor intenta más tarde.";
  }
};