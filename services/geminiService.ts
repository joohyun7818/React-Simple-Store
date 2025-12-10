import { GoogleGenAI, Type } from "@google/genai";
import { Product } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const searchProductsWithAI = async (query: string): Promise<Product[]> => {
  try {
    const modelId = "gemini-2.5-flash";
    
    const response = await ai.models.generateContent({
      model: modelId,
      contents: `Generate a list of 4 to 8 e-commerce products based on this user search query: "${query}". 
      The products should be realistic.
      Return the response in JSON format.
      The currency should be implied as KRW (South Korean Won), so prices should be appropriate (e.g., 10000, 50000, etc.).
      Images should be placeholder URLs like "https://picsum.photos/400/400?random=1".
      Descriptions should be in Korean.
      Names should be in Korean.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              price: { type: Type.NUMBER },
              description: { type: Type.STRING },
              category: { type: Type.STRING },
              imageUrl: { type: Type.STRING },
            },
            required: ["id", "name", "price", "description", "category", "imageUrl"],
          },
        },
      },
    });

    const jsonText = response.text;
    if (!jsonText) return [];
    
    const products: Product[] = JSON.parse(jsonText);
    
    // Ensure IDs are unique enough for UI keys if the AI repeats 1,2,3
    return products.map((p, index) => ({
        ...p,
        id: `${Date.now()}-${index}`,
        imageUrl: `https://picsum.photos/400/400?random=${Date.now() + index}`
    }));

  } catch (error) {
    console.error("Gemini API Error:", error);
    return [];
  }
};