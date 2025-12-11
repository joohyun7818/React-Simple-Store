import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { Product } from "../types";

// Lazy initialization to avoid crash if API_KEY is missing during module load
let ai: GoogleGenerativeAI | null = null;

const getAIClient = () => {
  if (!ai) {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error("API Key is missing. Please check your .env file.");
      return null;
    }
    ai = new GoogleGenerativeAI(apiKey);
  }
  return ai;
};

export const searchProductsWithAI = async (query: string): Promise<Product[]> => {
  try {
    const client = getAIClient();
    if (!client) {
      // Return mock data or empty array if no API key to prevent UI breakage
      return [];
    }

    const model = client.getGenerativeModel({
      model: "gemini-pro",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });
    
    const prompt = `Generate a list of 4 to 8 e-commerce products based on this user search query: "${query}". 
      The products should be realistic.
      Return the response in JSON format as an array of objects.
      The currency should be implied as KRW (South Korean Won), so prices should be appropriate (e.g., 10000, 50000, etc.).
      Images should be placeholder URLs like "https://picsum.photos/400/400?random=1".
      Descriptions should be in Korean.
      Names should be in Korean.
      
      Each product should have: id (string), name (string), price (number), description (string), category (string), imageUrl (string)`;

    const response = await model.generateContent(prompt);
    const jsonText = response.response.text();
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