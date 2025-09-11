
import { GoogleGenAI, Type } from "@google/genai";
import { Language, Level, Verb } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      verb: {
        type: Type.STRING,
        description: 'Czasownik w języku obcym w formie bezokolicznika.'
      },
      translation: {
        type: Type.STRING,
        description: 'Polskie tłumaczenie czasownika.'
      }
    },
    required: ['verb', 'translation']
  }
};

export const generateVerbs = async (language: Language, level: Level): Promise<Verb[]> => {
  const prompt = `Wygeneruj listę 50 popularnych czasowników w języku ${language} na poziomie ${level} (CEFR). Zwróć wynik jako tablicę obiektów JSON, gdzie każdy obiekt zawiera klucz "verb" z czasownikiem w języku obcym i klucz "translation" z jego polskim tłumaczeniem. Czasowniki powinny być w formie bezokolicznika.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonString = response.text.trim();
    const parsedVerbs: Verb[] = JSON.parse(jsonString);

    if (!Array.isArray(parsedVerbs) || parsedVerbs.some(v => typeof v.verb !== 'string' || typeof v.translation !== 'string')) {
      throw new Error('Invalid data structure received from API.');
    }
    
    return parsedVerbs;
  } catch (error) {
    console.error("Error generating verbs with Gemini API:", error);
    // Fallback to a predefined list in case of API error
    return getFallbackVerbs(language, level);
  }
};


const getFallbackVerbs = (language: Language, level: Level): Verb[] => {
    console.warn(`Falling back to predefined verb list for ${language} ${level}`);
    if (language === Language.ENGLISH) {
        return [
            { verb: 'be', translation: 'być' },
            { verb: 'have', translation: 'mieć' },
            { verb: 'do', translation: 'robić' },
            { verb: 'say', translation: 'powiedzieć' },
            { verb: 'go', translation: 'iść' },
        ];
    }
    if (language === Language.SPANISH) {
        return [
            { verb: 'ser', translation: 'być' },
            { verb: 'tener', translation: 'mieć' },
            { verb: 'hacer', translation: 'robić' },
            { verb: 'decir', translation: 'powiedzieć' },
            { verb: 'ir', translation: 'iść' },
        ];
    }
    return [];
}
