
import { GoogleGenAI } from "@google/genai";
import { Category } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you'd handle this more gracefully.
  // For this context, we will proceed, but API calls will fail.
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

// This check prevents crashing in an environment where process.env.API_KEY is not defined.
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

const availableCategories = Object.values(Category).join(', ');

export const suggestCategory = async (itemName: string): Promise<Category | null> => {
    if (!ai) {
        console.error("Gemini AI client is not initialized.");
        return null;
    }

    if (!itemName.trim()) {
        return null;
    }

    try {
        const prompt = `Given the item name "${itemName}", suggest the single most likely expense category. Choose from the following options: ${availableCategories}. Respond with ONLY the category name and nothing else.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                // Disable thinking for very low latency response
                thinkingConfig: { thinkingBudget: 0 }
            }
        });

        const suggestedCategoryText = response.text.trim();

        // Validate if the response is a valid category
        if (Object.values(Category).includes(suggestedCategoryText as Category)) {
            return suggestedCategoryText as Category;
        }

        return null;

    } catch (error) {
        console.error("Error suggesting category:", error);
        return null;
    }
};
