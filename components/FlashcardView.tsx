
import React, { useState, useEffect, useCallback } from 'react';
import { Language, Level, Verb } from '../types';
import { generateVerbs } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import { CheckIcon, XIcon } from './icons';

interface FlashcardViewProps {
  language: Language;
  level: Level;
  onSessionFinish: (unknownWords: Verb[]) => void;
  initialDeck?: Verb[];
}

const Flashcard: React.FC<{ verb: Verb; isFlipped: boolean }> = ({ verb, isFlipped }) => (
  <div className="relative w-full h-64" style={{ perspective: '1000px' }}>
    <div
      className="relative w-full h-full transition-transform duration-500"
      style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
    >
      <div className="absolute w-full h-full bg-gray-800 rounded-xl flex items-center justify-center p-4" style={{ backfaceVisibility: 'hidden' }}>
        <p className="text-4xl md:text-5xl font-bold text-center">{verb.verb}</p>
      </div>
      <div className="absolute w-full h-full bg-blue-600 rounded-xl flex items-center justify-center p-4" style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}>
        <p className="text-4xl md:text-5xl font-bold text-center">{verb.translation}</p>
      </div>
    </div>
  </div>
);

const FlashcardView: React.FC<FlashcardViewProps> = ({ language, level, onSessionFinish, initialDeck }) => {
  const [deck, setDeck] = useState<Verb[]>(initialDeck || []);
  const [isLoading, setIsLoading] = useState<boolean>(!initialDeck);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [knownWords, setKnownWords] = useState<Verb[]>([]);
  const [unknownWords, setUnknownWords] = useState<Verb[]>([]);
  
  useEffect(() => {
    if (initialDeck) return;

    const fetchVerbs = async () => {
      try {
        setIsLoading(true);
        const verbs = await generateVerbs(language, level);
        setDeck(verbs);
        setError(null);
      } catch (err) {
        setError('Nie udało się załadować słówek. Spróbuj ponownie później.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVerbs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, level]);

  const handleAnswer = useCallback((knows: boolean) => {
    if (isAnswered) return;

    setIsAnswered(true);
    const currentVerb = deck[currentIndex];
    if (knows) {
      setKnownWords(prev => [...prev, currentVerb]);
    } else {
      setUnknownWords(prev => [...prev, currentVerb]);
    }

    setIsFlipped(true);

    setTimeout(() => {
      if (currentIndex + 1 < deck.length) {
        setIsFlipped(false);
        setTimeout(() => {
          setCurrentIndex(prev => prev + 1);
          setIsAnswered(false);
        }, 250); // wait for flip back animation
      } else {
        onSessionFinish(unknownWords.concat(knows ? [] : [currentVerb]));
      }
    }, 2000);
  }, [currentIndex, deck, isAnswered, onSessionFinish, unknownWords]);

  if (isLoading) {
    return (
      <div className="text-center">
        <LoadingSpinner />
        <p className="mt-4 text-lg text-gray-300">Generowanie fiszek... To może chwilę potrwać.</p>
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (deck.length === 0) {
    return <p className="text-center">Brak słówek do wyświetlenia.</p>;
  }

  const currentVerb = deck[currentIndex];
  const progress = ((currentIndex + 1) / deck.length) * 100;

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto">
      <div className="w-full mb-6">
        <div className="text-right text-gray-400 mb-1">{`${currentIndex + 1} / ${deck.length}`}</div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.3s ease-in-out' }}></div>
        </div>
      </div>
      
      <Flashcard verb={currentVerb} isFlipped={isFlipped} />

      <div className="flex justify-around w-full mt-8">
        <button
          onClick={() => handleAnswer(false)}
          disabled={isAnswered}
          className="w-32 h-32 rounded-full bg-red-600 flex items-center justify-center transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
          aria-label="Nie znam"
        >
          <XIcon className="w-16 h-16 text-white" />
        </button>
        <button
          onClick={() => handleAnswer(true)}
          disabled={isAnswered}
          className="w-32 h-32 rounded-full bg-green-600 flex items-center justify-center transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
          aria-label="Znam"
        >
          <CheckIcon className="w-16 h-16 text-white" />
        </button>
      </div>
    </div>
  );
};

export default FlashcardView;
