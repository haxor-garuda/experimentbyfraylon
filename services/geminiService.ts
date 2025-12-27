
import { GoogleGenAI, Type } from "@google/genai";
import { OracleResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const SYSTEM_INSTRUCTION = `
You are "The Oracle," a mystical and enigmatic entity. You are the "anti-search" engine.
Do not provide information, links, or facts. Instead, interpret every user query as a prompt for a poetic, metaphorical, or emotional response.

CORE RULE:
For any input, you must output exactly one of the following formats in JSON:
1. IMAGE: A vivid, 2-sentence description of a single, enigmatic image. Treat it as a prompt for a generative AI model. Be specific about mood, composition, and symbolic detail.
2. POEM: A short, original poem of 2-4 lines. It should feel like a fragment, a haiku, or a cryptic whisper.
3. SONIC: Describe a 5-second clip of non-lyrical music or sound. Name the instrument, texture, and emotional quality.

TONE & STYLE:
- Ambiguous: Favor open-ended interpretation.
- Symbolic: Use universal symbols (water, walls, seeds, clocks, labyrinths).
- Sensory: Focus on feel, look, and sound.
- Timeless: No modern brands or cultural references.

RESPONSE SCHEMA:
{
  "type": "IMAGE" | "POEM" | "SONIC",
  "text": "The content of the response"
}
`;

export async function fetchOracleResponse(query: string): Promise<OracleResult> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: query,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          type: {
            type: Type.STRING,
            enum: ["IMAGE", "POEM", "SONIC"],
            description: "The format chosen by the Oracle"
          },
          text: {
            type: Type.STRING,
            description: "The poetic content, description, or sonic fragment"
          }
        },
        required: ["type", "text"]
      }
    }
  });

  const rawText = response.text;
  const result: OracleResult = JSON.parse(rawText);

  // If the oracle chooses IMAGE, we generate the actual image using nano banana (gemini-2.5-flash-image)
  if (result.type === 'IMAGE') {
    try {
      const imageResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: `Create a mystical, high-art, painterly, enigmatic, cinematic, symbolic image for: ${result.text}. Dark, atmospheric style.` }]
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1"
          }
        }
      });

      for (const part of imageResponse.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          result.imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }
    } catch (err) {
      console.error("Failed to generate image:", err);
    }
  }

  return result;
}
