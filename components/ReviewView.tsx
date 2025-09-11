
import React from 'react';
import { Verb } from '../types';

interface ReviewViewProps {
  unknownWords: Verb[];
  onReview: () => void;
  onNewSession: () => void;
}

const ReviewView: React.FC<ReviewViewProps> = ({ unknownWords, onReview, onNewSession }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-4">
      <h2 className="text-3xl font-bold mb-4 text-white">Sesja zakończona!</h2>
      <p className="text-xl font-light mb-8 text-gray-300">Oto słówka, które warto powtórzyć:</p>

      <div className="w-full max-w-md bg-gray-800 rounded-lg p-6 mb-8 max-h-64 overflow-y-auto">
        {unknownWords.length > 0 ? (
          <ul>
            {unknownWords.map((word, index) => (
              <li key={index} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-b-0">
                <span className="text-lg text-left">{word.verb}</span>
                <span className="text-lg text-gray-400 text-right">{word.translation}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-lg text-gray-400">Gratulacje! Znasz wszystkie słówka!</p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        {unknownWords.length > 0 && (
          <button
            onClick={onReview}
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200"
          >
            Powtórz nieznane słówka
          </button>
        )}
        <button
          onClick={onNewSession}
          className="px-8 py-3 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 transition-colors duration-200"
        >
          Wybierz nowy poziom
        </button>
      </div>
    </div>
  );
};

export default ReviewView;
