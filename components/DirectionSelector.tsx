import React from 'react';
import { Language, TranslationDirection } from '../types';
import { ArrowLeftIcon } from './icons';

interface DirectionSelectorProps {
  language: Language;
  onSelect: (direction: TranslationDirection) => void;
  onBack: () => void;
}

const DirectionButton: React.FC<{ text: string, subtext: string, onClick: () => void }> = ({ text, subtext, onClick }) => (
    <button
      onClick={onClick}
      className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg p-6 w-full md:w-80 h-32 flex flex-col items-center justify-center text-center transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500 focus-visible:ring-opacity-75 shadow-md"
    >
      <h3 className="text-2xl font-semibold text-white">{text}</h3>
      <p className="text-gray-400">{subtext}</p>
    </button>
);


const DirectionSelector: React.FC<DirectionSelectorProps> = ({ language, onSelect, onBack }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center relative">
      <button onClick={onBack} className="absolute top-0 left-0 text-gray-400 hover:text-white transition-colors">
        <ArrowLeftIcon className="w-8 h-8"/>
      </button>
      <h2 className="text-3xl font-bold mb-2 text-white">Kierunek nauki</h2>
      <p className="text-xl font-light mb-10 text-gray-300">Wybierz, w którą stronę chcesz tłumaczyć.</p>
      <div className="flex flex-col md:flex-row gap-8">
        <DirectionButton
            text={`${language} → Polski`}
            subtext="Zobaczysz słowo obce, odgadujesz po polsku."
            onClick={() => onSelect(TranslationDirection.FOREIGN_TO_POLISH)}
        />
        <DirectionButton
            text={`Polski → ${language}`}
            subtext="Zobaczysz słowo po polsku, odgadujesz obce."
            onClick={() => onSelect(TranslationDirection.POLISH_TO_FOREIGN)}
        />
      </div>
    </div>
  );
};

export default DirectionSelector;