import React, { useState, useEffect, useCallback } from 'react';
import { Verb, Language, Level, TranslationDirection } from '../types';
import { ArrowLeftIcon } from './icons';

interface FlashcardViewProps {
  deck: Verb[];
  language: Language;
  level: Level;
  direction: TranslationDirection;
  onBlockComplete: (unknownWords: Verb[]) => void;
  onSessionInterrupt: () => void;
  sessionTitle: string;
}

const FlashcardView: React.FC<FlashcardViewProps> = ({
  deck,
  language,
  level,
  direction,
  onBlockComplete,
  onSessionInterrupt,
  sessionTitle,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [unknownWords, setUnknownWords] = useState<Verb[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  useEffect(() => {
    // Reset state when deck changes
    setCurrentIndex(0);
    setIsFlipped(false);
    setUnknownWords([]);
    setIsTransitioning(false);
  }, [deck]);

  const handleAnswer = useCallback((known: boolean) => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    const currentVerb = deck[currentIndex];
    
    let updatedUnknownWords = unknownWords;
    if (!known) {
      updatedUnknownWords = [...unknownWords, currentVerb];
      setUnknownWords(updatedUnknownWords);
    }
    
    setIsFlipped(true);

    setTimeout(() => {
      setIsFlipped(false);
      
      setTimeout(() => {
        const isLastCard = currentIndex === deck.length - 1;
        if (isLastCard) {
          onBlockComplete(updatedUnknownWords);
        } else {
          setCurrentIndex(prev => prev + 1);
          setIsTransitioning(false);
        }
      }, 500); // Duration of flip back animation
    }, 1500); // Time to see the translation

  }, [currentIndex, deck, unknownWords, onBlockComplete, isTransitioning]);

  const handleManualFlip = () => {
    if (!isTransitioning) {
        setIsFlipped(prev => !prev);
    }
  };

  if (deck.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <p className="text-white">Brak fiszek w tej talii.</p>
        </div>
    );
  }

  const currentVerb = deck[currentIndex];
  const isPolishToForeign = direction === TranslationDirection.POLISH_TO_FOREIGN;
  const frontText = isPolishToForeign ? currentVerb.translation : currentVerb.verb;
  const backText = isPolishToForeign ? currentVerb.verb : currentVerb.translation;

  return (
    <div className="flex flex-col items-center justify-between h-full p-4 relative">
      <div className="w-full flex justify-between items-center text-gray-400 mb-4">
        <button onClick={onSessionInterrupt} className="hover:text-white transition-colors">
            <ArrowLeftIcon className="w-8 h-8"/>
        </button>
        <div className="text-center">
            <h2 className="text-xl font-bold text-white">{sessionTitle}</h2>
            <p className="text-sm">{language} - {level}</p>
        </div>
        <div className="w-8"></div>
      </div>
      
      <div className="w-full flex-grow flex items-center justify-center">
        <div 
          className="w-full max-w-md h-64 perspective-1000 cursor-pointer"
          onClick={handleManualFlip}
        >
          <div 
            className={`relative w-full h-full transform-style-preserve-3d transition-transform duration-500 ${isFlipped ? 'rotate-y-180' : ''}`}
          >
            {/* Front of card */}
            <div className="absolute w-full h-full backface-hidden bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center p-6 shadow-lg">
              <h3 className="text-4xl md:text-5xl font-bold text-white text-center">{frontText}</h3>
            </div>
            {/* Back of card */}
            <div className="absolute w-full h-full backface-hidden bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center p-6 shadow-lg transform rotate-y-180">
              <h3 className="text-4xl md:text-5xl font-bold text-white text-center">{backText}</h3>
            </div>
          </div>
        </div>
      </div>
      
      <div className="w-full flex flex-col items-center mt-4">
        <div className="w-full max-w-md mb-6">
            <div className="h-2 bg-gray-700 rounded-full">
                <div 
                    className="h-2 bg-blue-500 rounded-full transition-all duration-300" 
                    style={{ width: `${((currentIndex + 1) / deck.length) * 100}%` }}
                ></div>
            </div>
            <p className="text-center mt-2 text-gray-400">{currentIndex + 1} / {deck.length}</p>
        </div>

        <div className="w-full max-w-md flex justify-center gap-4 md:gap-6 mb-4">
          <button
            onClick={() => handleAnswer(false)}
            disabled={isTransitioning}
            className="flex-1 bg-gradient-to-br from-red-500 to-red-700 rounded-lg text-white font-bold py-4 text-xl transition-transform transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Nie znam
          </button>
          <button
            onClick={() => handleAnswer(true)}
            disabled={isTransitioning}
            className="flex-1 bg-gradient-to-br from-green-500 to-green-700 rounded-lg text-white font-bold py-4 text-xl transition-transform transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Znam
          </button>
        </div>
      </div>

       <style>{`
            .perspective-1000 { perspective: 1000px; }
            .transform-style-preserve-3d { transform-style: preserve-3d; }
            .rotate-y-180 { transform: rotateY(180deg); }
            .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
       `}</style>
    </div>
  );
};

export default FlashcardView;