import { GoogleGenAI, Type } from "@google/genai";
import { Language, Level, Word, WordCategory } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      word: {
        type: Type.STRING,
        description: 'Słowo w języku obcym w formie podstawowej.'
      },
      translation: {
        type: Type.STRING,
        description: 'Polskie tłumaczenie słowa.'
      }
    },
    required: ['word', 'translation']
  }
};


export const generateWords = async (language: Language, level: Level, category: WordCategory): Promise<Word[]> => {
  try {
    const prompt = `Wygeneruj listę 100 popularnych słów z kategorii "${category}" w języku ${language} na poziomie ${level} (CEFR). Zwróć wynik jako tablicę obiektów JSON, gdzie każdy obiekt zawiera klucz "word" ze słowem w języku obcym i klucz "translation" z jego polskim tłumaczeniem. Słowa powinny być w podstawowej formie (np. bezokolicznik dla czasowników, mianownik dla rzeczowników).`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonString = response.text.trim();
    return JSON.parse(jsonString);

  } catch (error) {
    console.error("Error generating words from Gemini API:", error);
    return getFallbackWords(language, level);
  }
};


const getFallbackWords = (language: Language, level: Level): Word[] => {
    console.warn(`Using fallback predefined word list for ${language} ${level}`);
    if (language === Language.ENGLISH) {
        return [
            { word: 'be', translation: 'być' },
            { word: 'have', translation: 'mieć' },
            { word: 'do', translation: 'robić' },
            { word: 'say', translation: 'powiedzieć' },
            { word: 'go', translation: 'iść' },
        ];
    }
    if (language === Language.SPANISH) {
        return [
            { word: 'ser', translation: 'być' },
            { word: 'tener', translation: 'mieć' },
            { word: 'hacer', translation: 'robić' },
            { word: 'decir', translation: 'powiedzieć' },
            { word: 'ir', translation: 'iść' },
        ];
    }
    return [];
}