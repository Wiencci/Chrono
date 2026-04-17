
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getTacticalBriefing(data: {
  battery: number;
  charging: boolean;
  weather: string | number;
  time: string;
  mode: string;
  appMode: string;
}) {
  try {
    const prompt = `
      You are an tactical AI advisor for a futuristic survival watch system.
      Provide a very short, immersive tactical briefing (max 20 words) based on these status:
      - Battery: ${data.battery}% ${data.charging ? '(Charging)' : ''}
      - Temp: ${data.weather}°C
      - Time: ${data.time}
      - Display Mode: ${data.mode}
      - App Module: ${data.appMode}
      
      Tone: Serious, tactical, efficient, futuristic.
      Language: Portuguese (Brazil).
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }] }],
    });

    return response.text || "SISTEMA OPERACIONAL ESTÁVEL.";
  } catch (error) {
    console.error("AI Briefing failed:", error);
    return "CONEXÃO COM CENTRAL TÁTICA INTERROMPIDA.";
  }
}
