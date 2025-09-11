import React from 'react';
import { Language } from '../types';
import { UKFlag, SpainFlag } from './icons';

interface LanguageSelectorProps {
  onSelect: (language: Language) => void;
}

const LanguageOption: React.FC<{ language: Language, flag: React.ReactNode, onClick: () => void }> = ({ language, flag, onClick }) => (
  <button
    onClick={onClick}
    className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg p-6 w-full md:w-64 h-48 flex flex-col items-center justify-center text-center transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/30 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500 focus-visible:ring-opacity-75 shadow-lg"
  >
    <div className="w-24 h-16 mb-4">{flag}</div>
    <h3 className="text-2xl font-semibold text-white">{language}</h3>
  </button>
);

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onSelect }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <h1 className="text-4xl font-bold mb-4 text-white">Witaj w nauce czasowników!</h1>
      <h2 className="text-2xl font-light mb-12 text-gray-300">Wybierz język, którego chcesz się uczyć.</h2>
      <div className="flex flex-col md:flex-row gap-8">
        <LanguageOption 
          language={Language.ENGLISH} 
          flag={<UKFlag className="w-full h-full object-cover rounded" />} 
          onClick={() => onSelect(Language.ENGLISH)} 
        />
        <LanguageOption 
          language={Language.SPANISH} 
          flag={<SpainFlag className="w-full h-full object-cover rounded" />} 
          onClick={() => onSelect(Language.SPANISH)} 
        />
      </div>
    </div>
  );
};

export default LanguageSelector;