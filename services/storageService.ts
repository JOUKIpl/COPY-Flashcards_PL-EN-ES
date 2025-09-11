import { Language, Verb } from '../types';

const UNKNOWN_VERBS_PREFIX = 'unknown_verbs_';

export const getUnknownWords = (language: Language): Verb[] => {
  try {
    const key = `${UNKNOWN_VERBS_PREFIX}${language}`;
    const storedWords = localStorage.getItem(key);
    return storedWords ? JSON.parse(storedWords) : [];
  } catch (error) {
    console.error("Error retrieving unknown words from localStorage:", error);
    return [];
  }
};

export const saveUnknownWords = (language: Language, words: Verb[]): void => {
  try {
    const uniqueWordsMap = new Map<string, Verb>();
    words.forEach(word => uniqueWordsMap.set(word.verb, word));
    const uniqueWords = Array.from(uniqueWordsMap.values());

    const key = `${UNKNOWN_VERBS_PREFIX}${language}`;
    localStorage.setItem(key, JSON.stringify(uniqueWords));
  } catch (error) {
    console.error("Error saving unknown words to localStorage:", error);
  }
};

export const addUnknownWords = (language: Language, newWords: Verb[]): void => {
  const existingWords = getUnknownWords(language);
  saveUnknownWords(language, [...existingWords, ...newWords]);
};

export const removeKnownWords = (language: Language, wordsToRemove: Verb[]): void => {
  const existingWords = getUnknownWords(language);
  const wordsToRemoveSet = new Set(wordsToRemove.map(w => w.verb));
  const updatedWords = existingWords.filter(word => !wordsToRemoveSet.has(word.verb));
  saveUnknownWords(language, updatedWords);
};
