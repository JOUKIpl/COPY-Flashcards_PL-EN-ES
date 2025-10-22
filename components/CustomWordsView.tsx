import React, { useState, useEffect, useCallback } from 'react';
import { Language, Word } from '../types';
import * as storage from '../services/storageService';
import { ArrowLeftIcon, TrashIcon } from './icons';

interface CustomWordsViewProps {
  language: Language;
  onBack: () => void;
  onStart: () => void;
}

const CustomWordsView: React.FC<CustomWordsViewProps> = ({ language, onBack, onStart }) => {
  const [words, setWords] = useState<Word[]>([]);
  const [newWord, setNewWord] = useState('');
  const [newTranslation, setNewTranslation] = useState('');
  const [bulkText, setBulkText] = useState('');

  useEffect(() => {
    setWords(storage.getCustomWords(language));
  }, [language]);

  const handleSave = useCallback((updatedWords: Word[]) => {
    storage.saveCustomWords(language, updatedWords);
    setWords(updatedWords);
  }, [language]);

  const handleAddWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (newWord.trim() && newTranslation.trim()) {
      const wordToAdd: Word = { word: newWord.trim(), translation: newTranslation.trim() };
      const currentWords = storage.getCustomWords(language);
      handleSave([...currentWords, wordToAdd]);
      setNewWord('');
      setNewTranslation('');
    }
  };
  
  const handleBulkAdd = () => {
    const lines = bulkText.split('\n').filter(line => line.trim() !== '');
    const newWordsToAdd: Word[] = [];
    lines.forEach(line => {
      const parts = line.split(/[,;-]/).map(p => p.trim());
      if (parts.length === 2 && parts[0] && parts[1]) {
        newWordsToAdd.push({ word: parts[0], translation: parts[1] });
      }
    });

    if (newWordsToAdd.length > 0) {
      const currentWords = storage.getCustomWords(language);
      handleSave([...currentWords, ...newWordsToAdd]);
      setBulkText('');
    } else {
      alert('Nie znaleziono poprawnych par "słowo - tłumaczenie". Użyj formatu: słowo,tłumaczenie (jedno na linię).');
    }
  };

  const handleDeleteWord = (wordToDelete: string) => {
    const currentWords = storage.getCustomWords(language);
    const updatedWords = currentWords.filter(word => word.word !== wordToDelete);
    handleSave(updatedWords);
  };

  return (
    <div className="flex flex-col h-full text-center relative p-4">
      <div className="flex justify-between items-center mb-6">
        <button onClick={onBack} className="text-gray-400 hover:text-white transition-colors">
          <ArrowLeftIcon className="w-8 h-8"/>
        </button>
        <h1 className="text-3xl font-bold text-white">Własne fiszki ({language})</h1>
        <div className="w-8" />
      </div>

      <div className="flex flex-col md:flex-row gap-8 flex-grow overflow-hidden">
        {/* Left Panel: Add Words */}
        <div className="md:w-1/2 flex flex-col gap-6 bg-gray-800/50 p-6 rounded-lg">
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-left">Dodaj nową fiszkę</h2>
            <form onSubmit={handleAddWord} className="flex flex-col gap-4">
              <input 
                type="text" 
                value={newWord}
                onChange={(e) => setNewWord(e.target.value)}
                placeholder={`Słowo (${language})`}
                className="w-full bg-gray-700 text-white p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <input 
                type="text"
                value={newTranslation}
                onChange={(e) => setNewTranslation(e.target.value)}
                placeholder="Tłumaczenie (Polski)"
                className="w-full bg-gray-700 text-white p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition-colors">
                Dodaj
              </button>
            </form>
          </div>
          <div className="border-t border-gray-700 pt-6">
            <h2 className="text-2xl font-semibold mb-4 text-left">Dodaj hurtowo</h2>
            <textarea
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              placeholder="słowo1,tłumaczenie1&#10;word2,translation2"
              rows={4}
              className="w-full bg-gray-700 text-white p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
             <button onClick={handleBulkAdd} className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-md transition-colors">
                Importuj listę
              </button>
          </div>
        </div>

        {/* Right Panel: Word List */}
        <div className="md:w-1/2 flex flex-col bg-gray-800/50 p-6 rounded-lg">
           <h2 className="text-2xl font-semibold mb-4 text-left">Twoja lista ({words.length})</h2>
           <div className="flex-grow overflow-y-auto pr-2">
            {words.length > 0 ? (
                <ul className="space-y-2 text-left">
                  {words.map(word => (
                    <li key={word.word} className="flex justify-between items-center bg-gray-700 p-3 rounded-md">
                      <div>
                        <p className="font-semibold text-white">{word.word}</p>
                        <p className="text-gray-400">{word.translation}</p>
                      </div>
                      <button onClick={() => handleDeleteWord(word.word)} className="text-gray-500 hover:text-red-500 p-2 rounded-full transition-colors">
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </li>
                  ))}
                </ul>
            ) : (
                <p className="text-gray-400 text-center mt-8">Nie masz jeszcze żadnych własnych fiszek.</p>
            )}
           </div>
        </div>
      </div>
      
      <div className="mt-8">
        <button 
          onClick={onStart} 
          disabled={words.length === 0}
          className="bg-gradient-to-br from-purple-500 to-purple-700 text-white font-bold py-4 px-12 rounded-lg transition-transform transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-600 disabled:to-gray-700"
        >
          Rozpocznij naukę
        </button>
      </div>
    </div>
  );
};

export default CustomWordsView;