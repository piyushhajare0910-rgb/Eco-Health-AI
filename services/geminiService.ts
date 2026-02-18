
import { GoogleGenAI } from "@google/genai";
import { EnvironmentalData, DiseasePrediction } from "../types";

export const getAIInsights = async (
  envData: EnvironmentalData,
  location: string,
  predictions: DiseasePrediction[]
): Promise<string> => {
  // Always use the process.env.API_KEY directly for initialization
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Act as a senior epidemiologist. Analyze the following environmental data and disease outbreak risks for ${location}:
    
    ENVIRONMENTAL DATA:
    - AQI: ${envData.aqi}
    - Temperature: ${envData.temperature}°C
    - Humidity: ${envData.humidity}%
    - Rainfall: ${envData.rainfall}mm
    - Population Density: ${envData.populationDensity}/sqkm
    
    PREDICTIONS:
    ${predictions.map(p => `- ${p.name}: ${p.probability}% risk`).join('\n')}
    
    Provide a concise (3-4 sentences) professional insight explaining the correlation between the environmental factors and the highest risks. Highlight any critical actions needed.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    return response.text || "AI insight currently unavailable.";
  } catch (error) {
    console.error("AI Insight Error:", error);
    return "Error generating AI insights. Please check environmental factors manually.";
  }
};
