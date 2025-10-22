import React from 'react';
import { Language, Level, WordCategory } from '../types';
import { ArrowLeftIcon } from './icons';

interface CategorySelectorProps {
  language: Language;
  level: Level;
  onSelect: (category: WordCategory) => void;
  onBack: () => void;
}

const CategoryButton: React.FC<{ category: WordCategory, onClick: () => void }> = ({ category, onClick }) => (
  <button
    onClick={onClick}
    className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg p-4 w-full h-full flex items-center justify-center text-center transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500 focus-visible:ring-opacity-75 shadow-md"
  >
    <h3 className="text-lg font-semibold text-white">{category}</h3>
  </button>
);

const CategorySelector: React.FC<CategorySelectorProps> = ({ language, level, onSelect, onBack }) => {
  const inflectedCategories = [
    WordCategory.NOUN,
    WordCategory.ADJECTIVE,
    WordCategory.VERB,
    WordCategory.NUMERAL,
    WordCategory.PRONOUN,
  ];

  const uninflectedCategories = [
    WordCategory.ADVERB,
    WordCategory.PREPOSITION,
    WordCategory.CONJUNCTION,
    WordCategory.INTERJECTION,
    WordCategory.PARTICLE,
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full text-center relative">
      <button onClick={onBack} className="absolute top-0 left-0 text-gray-400 hover:text-white transition-colors">
        <ArrowLeftIcon className="w-8 h-8"/>
      </button>
      <h2 className="text-3xl font-bold mb-2 text-white">Wybierz kategorię słów</h2>
      <p className="text-xl font-light mb-10 text-gray-300">Uczysz się <span className="font-semibold text-blue-400">{language}</span> na poziomie <span className="font-semibold text-blue-400">{level}</span>.</p>
      
      <div className="w-full max-w-3xl flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <h3 className="text-2xl font-semibold mb-4 text-gray-300">Części mowy odmienne</h3>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {inflectedCategories.map((category) => (
              <CategoryButton key={category} category={category} onClick={() => onSelect(category)} />
            ))}
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-semibold mb-4 text-gray-300">Części mowy nieodmienne</h3>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {uninflectedCategories.map((category) => (
              <CategoryButton key={category} category={category} onClick={() => onSelect(category)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategorySelector;