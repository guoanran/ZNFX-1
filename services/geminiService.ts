
import { GoogleGenAI } from "@google/genai";

// Initialize GoogleGenAI with process.env.API_KEY directly per SDK guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getIntelligentInsight = async (taskName: string, context: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a remote sensing specialist. Analyze the following task: "${taskName}". 
      The detected features are: ${context}. 
      Provide a professional interpretation summary including potential ecological or economic impacts in 3-4 sentences.`,
    });
    return response.text;
  } catch (error) {
    console.error("AI Insight Error:", error);
    return "Unable to generate AI insight at this time. Please check your connectivity.";
  }
};
