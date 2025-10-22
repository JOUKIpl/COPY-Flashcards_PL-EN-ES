import { Language, Word } from '../types';

const UNKNOWN_WORDS_PREFIX = 'unknown_words_';
const CUSTOM_WORDS_PREFIX = 'custom_words_';

export const getUnknownWords = (language: Language): Word[] => {
  try {
    const key = `${UNKNOWN_WORDS_PREFIX}${language}`;
    const storedWords = localStorage.getItem(key);
    return storedWords ? JSON.parse(storedWords) : [];
  } catch (error) {
    console.error("Error retrieving unknown words from localStorage:", error);
    return [];
  }
};

export const saveUnknownWords = (language: Language, words: Word[]): void => {
  try {
    const uniqueWordsMap = new Map<string, Word>();
    words.forEach(word => uniqueWordsMap.set(word.word, word));
    const uniqueWords = Array.from(uniqueWordsMap.values());

    const key = `${UNKNOWN_WORDS_PREFIX}${language}`;
    localStorage.setItem(key, JSON.stringify(uniqueWords));
  } catch (error) {
    console.error("Error saving unknown words to localStorage:", error);
  }
};

export const addUnknownWords = (language: Language, newWords: Word[]): void => {
  const existingWords = getUnknownWords(language);
  saveUnknownWords(language, [...existingWords, ...newWords]);
};

export const removeKnownWords = (language: Language, wordsToRemove: Word[]): void => {
  const existingWords = getUnknownWords(language);
  const wordsToRemoveSet = new Set(wordsToRemove.map(w => w.word));
  const updatedWords = existingWords.filter(word => !wordsToRemoveSet.has(word.word));
  saveUnknownWords(language, updatedWords);
};

export const getCustomWords = (language: Language): Word[] => {
  try {
    const key = `${CUSTOM_WORDS_PREFIX}${language}`;
    const storedWords = localStorage.getItem(key);
    return storedWords ? JSON.parse(storedWords) : [];
  } catch (error) {
    console.error("Error retrieving custom words from localStorage:", error);
    return [];
  }
};

export const saveCustomWords = (language: Language, words: Word[]): void => {
  try {
    // Ensure no duplicates based on the foreign word (case-insensitive)
    const uniqueWordsMap = new Map<string, Word>();
    words.forEach(word => uniqueWordsMap.set(word.word.toLowerCase(), word));
    const uniqueWords = Array.from(uniqueWordsMap.values());

    const key = `${CUSTOM_WORDS_PREFIX}${language}`;
    localStorage.setItem(key, JSON.stringify(uniqueWords));
  } catch (error) {
    console.error("Error saving custom words to localStorage:", error);
  }
};
