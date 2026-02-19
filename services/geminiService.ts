
import { GoogleGenAI, Type } from "@google/genai";
import { Specialty } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getSpecialtyRecommendation = async (symptoms: string): Promise<{ specialty: Specialty; reason: string }> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Basado en estos síntomas: "${symptoms}", recomienda la especialidad médica más apropiada entre: Cardiología, Pediatría, Dermatología, Neurología, Medicina General, Oftalmología. Responde en español.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          specialty: {
            type: Type.STRING,
            description: "Debe ser una de: Cardiología, Pediatría, Dermatología, Neurología, Medicina General, Oftalmología"
          },
          reason: {
            type: Type.STRING,
            description: "Una breve y amable explicación en español de por qué se recomienda esta especialidad."
          }
        },
        required: ["specialty", "reason"]
      }
    }
  });

  try {
    const data = JSON.parse(response.text);
    return data;
  } catch (e) {
    return { 
      specialty: 'Medicina General', 
      reason: "Basado en tu descripción, una consulta general es el mejor punto de partida." 
    };
  }
};
