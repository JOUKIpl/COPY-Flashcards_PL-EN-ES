import React, { useState, useEffect } from 'react';
import { Language, Level } from '../types';
import * as storage from '../services/storageService';
import { ArrowLeftIcon } from './icons';

interface LevelSelectorProps {
  language: Language;
  onSelect: (level: Level) => void;
  onBack: () => void;
  onStartReview: () => void;
}

const LevelButton: React.FC<{ level: Level, onClick: () => void }> = ({ level, onClick }) => (
  <button
    onClick={onClick}
    className="bg-gray-800 rounded-lg p-6 w-32 h-32 flex items-center justify-center text-3xl font-bold transition-transform transform hover:scale-105 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    {level}
  </button>
);

const LevelSelector: React.FC<LevelSelectorProps> = ({ language, onSelect, onBack, onStartReview }) => {
  const levels = Object.values(Level);
  const [reviewCount, setReviewCount] = useState<number>(0);

  useEffect(() => {
    const unknownWords = storage.getUnknownWords(language);
    setReviewCount(unknownWords.length);
  }, [language]);

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
       <button onClick={onBack} className="absolute top-6 left-6 text-gray-400 hover:text-white transition-colors">
        <ArrowLeftIcon className="w-8 h-8"/>
      </button>
      <h2 className="text-3xl font-bold mb-2 text-white">Wybrany język: <span className="text-blue-400">{language}</span></h2>
      <p className="text-xl font-light mb-10 text-gray-300">Wybierz poziom trudności lub powtórz słówka.</p>
      
      {reviewCount > 0 && (
        <div className="w-full max-w-xs mb-8">
            <button
                onClick={onStartReview}
                className="w-full bg-green-600 text-white font-semibold rounded-lg shadow-md px-8 py-4 hover:bg-green-700 transition-colors duration-200 text-lg"
            >
                Powtórz nieznane słówka ({reviewCount})
            </button>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {levels.map((level) => (
          <LevelButton key={level} level={level} onClick={() => onSelect(level)} />
        ))}
      </div>
    </div>
  );
};

export default LevelSelector;
