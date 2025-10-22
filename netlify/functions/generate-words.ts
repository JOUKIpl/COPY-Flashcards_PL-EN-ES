import { GoogleGenAI, Type } from "@google/genai";

// Definicja typu dla zdarzenia przekazywanego przez Netlify Functions
interface NetlifyEvent {
  httpMethod: string;
  body: string;
}

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

export const handler = async (event: NetlifyEvent) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  if (!process.env.API_KEY) {
    console.error("API_KEY environment variable not set on server");
    return { statusCode: 500, body: JSON.stringify({ error: 'Błąd konfiguracji serwera.' }) };
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const { language, level, category } = JSON.parse(event.body);
    
    if (!language || !level || !category) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Brakujące parametry: język, poziom i kategoria są wymagane.' }) };
    }

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
    const parsedWords = JSON.parse(jsonString);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsedWords)
    };

  } catch (error) {
    console.error("Błąd w funkcji generate-words:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Nie udało się wygenerować słów z API Gemini.' })
    };
  }
};
