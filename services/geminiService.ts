
import { GoogleGenAI, Type, Chat } from "@google/genai";
import { AIAnalysisResult, ItemCategory } from "../types";

// Helper to convert file to base64
export const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data url prefix (e.g. "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const analyzeItemImage = async (base64Image: string, mimeType: string): Promise<AIAnalysisResult> => {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      console.error("Gemini Service: API Key is missing");
      throw new Error("API Key is missing");
    }
    console.log("Gemini Service: API Key present (ends with " + apiKey.slice(-4) + ")");

    const ai = new GoogleGenAI({ apiKey });

    // Updated model to gemini-3-flash-preview for multimodal tasks
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image
            }
          },
          {
            text: "Analyze this image of a lost/found item. Identify what it is, suggest a title, categorize it, describe it briefly (visual features like wear, brand, stickers), and identify the main color."
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "A short, clear title for the item (e.g. 'Blue Nike Backpack')" },
            category: {
              type: Type.STRING,
              enum: Object.values(ItemCategory),
              description: "The most appropriate category"
            },
            description: { type: Type.STRING, description: "A concise visual description of the item." },
            color: { type: Type.STRING, description: "The primary color of the item." }
          },
          required: ["title", "category", "description", "color"]
        }
      }
    });

    // Extracting text output via property (not method) and parsing JSON
    const result = JSON.parse(response.text || "{}") as AIAnalysisResult;
    return result;
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    // Return a fallback or rethrow depending on needs. Returning empty allows manual fill.
    throw error;
  }
};

// --- CHATBOT SERVICE ---

export const initChatSession = (): Chat => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Initializing chat with gemini-3-pro-preview for advanced reasoning
  return ai.chats.create({
    model: 'gemini-1.5-pro',
    config: {
      systemInstruction: `You are the helpful AI assistant for "LOSTit", a smart lost and found application for universities and public spaces. 
      
      Your goal is to help users:
      1. Guide them on how to report a lost or found item.
      2. Explain how the AI auto-tagging works (using Gemini Vision).
      3. Explain the safety features (QR codes, secure messaging).
      4. Answer general questions about recovering lost items.
      
      Tone: Friendly, empathetic, and concise.
      
      Key App Features to know:
      - Users can upload photos to auto-fill details.
      - We use AWS Serverless backend.
      - We protect privacy by masking contact info until a claim is verified.
      
      If a user asks about a specific lost item, explain that you cannot browse the live database directly in this chat, and guide them to the "Gallery" page to search using the filter tools.`,
    },
  });
};
