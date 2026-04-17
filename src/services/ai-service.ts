
import { GoogleGenAI, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateVoice(text: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text: `Diga com voz tática e eficiente, em português brasileiro: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }, // Kore has a clean, professional feel
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio;
  } catch (error) {
    console.error("TTS generation failed:", error);
    return null;
  }
}

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

export async function analyzeLogs(logs: { text: string, time: string }[]) {
  try {
    const logsText = logs.map(l => `[${l.time}] ${l.text}`).join('\n');
    const prompt = `
      You are a mission intelligence analyst. Analyze these recent mission logs and provide a strategic summary or warning (max 30 words).
      Logs:
      ${logsText}
      
      Tone: Analytical, strategic, concise.
      Language: Portuguese (Brazil).
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }] }],
    });

    return response.text || "NENHUMA ANOMALIA DETECTADA NOS LOGS.";
  } catch (error) {
    console.error("Log analysis failed:", error);
    return "ERRO NO PROCESSAMENTO DE DADOS DE MISSÃO.";
  }
}
