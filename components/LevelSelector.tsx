import React, { useState, useEffect } from 'react';
import { Language, Level } from '../types';
import * as storage from '../services/storageService';
import { ArrowLeftIcon, RepeatIcon, BookOpenIcon } from './icons';

interface LevelSelectorProps {
  language: Language;
  onSelect: (level: Level) => void;
  onBack: () => void;
  onStartReview: () => void;
  onSelectCustom: () => void;
}

const LevelButton: React.FC<{ level: Level, onClick: () => void }> = ({ level, onClick }) => (
  <button
    onClick={onClick}
    className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg p-6 w-32 h-32 flex items-center justify-center text-3xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500 focus-visible:ring-opacity-75 shadow-md"
  >
    {level}
  </button>
);

const LevelSelector: React.FC<LevelSelectorProps> = ({ language, onSelect, onBack, onStartReview, onSelectCustom }) => {
  const levels = Object.values(Level).filter(l => l !== Level.CUSTOM);
  const [reviewCount, setReviewCount] = useState<number>(0);
  const [customCount, setCustomCount] = useState<number>(0);

  useEffect(() => {
    const unknownWords = storage.getUnknownWords(language);
    setReviewCount(unknownWords.length);
    const customWords = storage.getCustomWords(language);
    setCustomCount(customWords.length);
  }, [language]);

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
       <button onClick={onBack} className="absolute top-6 left-6 text-gray-400 hover:text-white transition-colors">
        <ArrowLeftIcon className="w-8 h-8"/>
      </button>
      <h2 className="text-3xl font-bold mb-2 text-white">Wybrany język: <span className="text-blue-400">{language}</span></h2>
      <p className="text-xl font-light mb-10 text-gray-300">Wybierz poziom lub zarządzaj własnymi fiszkami.</p>
      
      <div className="w-full max-w-md mb-10 flex flex-col gap-6">
        {reviewCount > 0 && (
          <div className="w-full bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl shadow-lg p-6 flex flex-col items-center">
              <div className="flex items-center gap-3 text-gray-300 mb-3">
                  <RepeatIcon className="w-6 h-6"/>
                  <h3 className="text-xl font-semibold">Postępy w nauce</h3>
              </div>
              <p className="text-base text-gray-400">Liczba słówek do powtórzenia:</p>
              <p className="text-6xl font-bold text-blue-400 my-2">{reviewCount}</p>
              <button
                  onClick={onStartReview}
                  className="w-full bg-gradient-to-br from-green-500 to-green-700 text-white font-semibold rounded-lg shadow-md px-8 py-3 hover:from-green-600 hover:to-green-800 transition-all duration-200 text-lg transform hover:scale-105 focus:outline-none focus-visible:ring-4 focus-visible:ring-green-500 focus-visible:ring-opacity-50"
              >
                  Rozpocznij powtórkę
              </button>
          </div>
        )}

        <div className="w-full bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl shadow-lg p-6 flex flex-col items-center">
            <div className="flex items-center gap-3 text-gray-300 mb-3">
                <BookOpenIcon className="w-6 h-6"/>
                <h3 className="text-xl font-semibold">Własne fiszki</h3>
            </div>
            <p className="text-base text-gray-400">Liczba Twoich fiszek:</p>
            <p className="text-6xl font-bold text-blue-400 my-2">{customCount}</p>
            <button
                onClick={onSelectCustom}
                className="w-full bg-gradient-to-br from-blue-500 to-blue-700 text-white font-semibold rounded-lg shadow-md px-8 py-3 hover:from-blue-600 hover:to-blue-800 transition-all duration-200 text-lg transform hover:scale-105 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500 focus-visible:ring-opacity-50"
            >
                {customCount > 0 ? 'Zarządzaj / Ucz się' : 'Dodaj własne fiszki'}
            </button>
        </div>
      </div>


      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {levels.map((level) => (
          <LevelButton key={level} level={level} onClick={() => onSelect(level)} />
        ))}
      </div>
    </div>
  );
};

export default LevelSelector;
