import { GoogleGenAI, Type } from "@google/genai";
import { FileMetadata, AnalysisResult, ThreatLevel } from "../types";
import { readFileAsBase64, readFileAsText, isCodeOrTextFile } from "../utils/fileHelpers";

// List of MIME types that Gemini accepts as inlineData (media)
const SUPPORTED_MEDIA_TYPES = [
  'image/png', 'image/jpeg', 'image/webp', 'image/heic', 'image/heif',
  'application/pdf',
  'audio/wav', 'audio/mp3', 'audio/aiff', 'audio/aac', 'audio/ogg', 'audio/flac',
  'video/mp4', 'video/mpeg', 'video/mov', 'video/avi', 'video/x-flv', 'video/mpg', 'video/webm', 'video/wmv', 'video/3gpp'
];

const parseGeminiResponse = (text: string): AnalysisResult => {
  try {
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText) as AnalysisResult;
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    return {
      threatLevel: ThreatLevel.UNKNOWN,
      score: 0,
      summary: "Analysis completed but response format was invalid.",
      technicalDetails: ["Raw response parsing failed"],
      recommendation: "Please try re-uploading the file."
    };
  }
};

const checkLocalBackend = async (file: File): Promise<AnalysisResult | null> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 3000); // 3 sec timeout for detection

    const response = await fetch('http://localhost:5000/analyze', {
      method: 'POST',
      body: formData,
      signal: controller.signal
    });
    
    clearTimeout(id);

    if (response.ok) {
      const data = await response.json();
      return parseGeminiResponse(data.analysis);
    }
    return null;
  } catch (e) {
    return null; // Local backend not available
  }
};

export const analyzeFileWithGemini = async (file: File, metadata: FileMetadata): Promise<AnalysisResult> => {
  // 1. Try Local Python Backend first (Hybrid Engine)
  const localResult = await checkLocalBackend(file);
  if (localResult) {
    return { ...localResult, summary: "[Local Engine] " + localResult.summary };
  }

  // 2. Fallback to Cloud API
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing in environment variables");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Define the schema for strict JSON output
  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      threatLevel: {
        type: Type.STRING,
        enum: [ThreatLevel.SAFE, ThreatLevel.SUSPICIOUS, ThreatLevel.DANGEROUS],
      },
      score: { type: Type.NUMBER, description: "0-100 score where 100 is most dangerous" },
      summary: { type: Type.STRING },
      technicalDetails: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
      },
      recommendation: { type: Type.STRING },
    },
    required: ["threatLevel", "score", "summary", "technicalDetails", "recommendation"],
  };

  const systemInstruction = `
    You are FileGuard AI, an elite cybersecurity and digital forensics engine.
    
    Your task is to analyze the provided file content and metadata to detect security threats with HIGH ACCURACY.
    
    CRITICAL ANALYSIS RULES:
    
    1. **MAGIC BYTE MISMATCH IS FATAL**: 
       - The provided Hex Header is: "${metadata.magicBytes}".
       - The provided Extension is: ".${metadata.extension}".
       - If the hex header indicates a text file (e.g., starts with readable text hex) but the extension is an image/executable (e.g., .jpg, .exe), YOU MUST MARK THIS AS DANGEROUS immediately. This is a common spoofing attack.
    
    2. **CODE & SCRIPT ANALYSIS**:
       - Scan for obfuscated code (e.g., 'eval(atob(...))', hex-encoded strings).
       - Scan for dangerous commands (e.g., 'rm -rf', 'system32', 'powershell -encoded').
       - If a file looks like a script (.js, .py, .bat) and contains obfuscation, it is SUSPICIOUS or DANGEROUS.
    
    3. **SAFE FILES**:
       - Plain text files with human-readable content and no code syntax are SAFE.
       - Standard images with correct headers and no appended scripts are SAFE.
    
    METADATA:
    - Name: ${metadata.name}
    - Type: ${metadata.type}
    - Size: ${metadata.size} bytes
    
    Output strictly in JSON format matching the schema.
  `;

  try {
    const parts: any[] = [];
    
    // STRATEGY SELECTION
    if (isCodeOrTextFile(file)) {
      // STRATEGY A: Text/Code -> Send as text prompt
      const textContent = await readFileAsText(file);
      // Truncate to avoid token limits if extremely large (approx 100k chars is safe for Flash)
      const truncatedText = textContent.slice(0, 100000); 
      parts.push({ 
        text: `Analyze this file content:\n\n${truncatedText}${textContent.length > 100000 ? '\n...(truncated)...' : ''}` 
      });
    } 
    else if (SUPPORTED_MEDIA_TYPES.includes(file.type)) {
      // STRATEGY B: Supported Media -> Send as Inline Data
      const base64Data = await readFileAsBase64(file);
      parts.push({
        inlineData: {
          mimeType: file.type,
          data: base64Data
        }
      });
      parts.push({ text: "Analyze this media file for visual anomalies or embedded threats." });
    } 
    else {
      // STRATEGY C: Unsupported Binary -> Metadata Only
      // Do NOT send the body to avoid API errors.
      parts.push({ 
        text: `The file '${metadata.name}' is a binary format (${metadata.type || 'unknown'}) that cannot be fully uploaded for content inspection. Perform analysis strictly based on the provided Magic Bytes (${metadata.magicBytes}) and file extension characteristics.` 
      });
    }

    // Explicitly using the array format for contents which is more robust
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: 'user', parts }], 
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.1,
      },
    });

    if (response.text) {
      return parseGeminiResponse(response.text);
    } else {
      throw new Error("Empty response from analysis engine");
    }

  } catch (error: any) {
    console.error("Gemini Analysis Error:", error);
    
    // Expose actual error details instead of masking everything
    if (error.message) {
        if (error.message.includes("400")) {
            // Check for specific known 400 issues
            if (error.message.includes("mime type")) {
                throw new Error("The AI model does not support this file's media format.");
            }
            if (error.message.includes("API key")) {
                 throw new Error("API Key Invalid or Expired.");
            }
        }
        if (error.message.includes("413")) {
            throw new Error("File size exceeds analysis limit.");
        }
    }
    
    // Return the original error message to help debugging
    throw new Error(error.message || "Analysis service unavailable.");
  }
};
