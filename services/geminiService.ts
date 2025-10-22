import { Language, Level, Word, WordCategory } from '../types';

export const generateWords = async (language: Language, level: Level, category: WordCategory): Promise<Word[]> => {
  try {
    const response = await fetch('/.netlify/functions/generate-words', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ language, level, category }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Nieznany błąd serwera.' }));
        throw new Error(errorData.error || `Błąd serwera: ${response.status}`);
    }
    
    const parsedWords: Word[] = await response.json();

    if (!Array.isArray(parsedWords)) {
      throw new Error('Otrzymano nieprawidłową strukturę danych z serwera.');
    }
    
    return parsedWords;

  } catch (error) {
    console.error("Błąd podczas pobierania słów z funkcji backendu:", error);
    // Zachowaj logikę zapasową po stronie klienta na wypadek błędu sieci lub serwera
    return getFallbackWords(language, level);
  }
};


const getFallbackWords = (language: Language, level: Level): Word[] => {
    console.warn(`Używanie zapasowej, predefiniowanej listy słów dla ${language} ${level}`);
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