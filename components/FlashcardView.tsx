import React, { useState, useEffect, useCallback } from 'react';
import { Language, Level, Verb, TranslationDirection } from '../types';
import { generateVerbs } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import { CheckIcon, XIcon, ArrowLeftIcon } from './icons';

interface FlashcardViewProps {
  language: Language;
  level: Level | null;
  onSessionFinish: (unknownWords: Verb[], knownWords: Verb[]) => void;
  initialDeck?: Verb[];
  translationDirection: TranslationDirection;
  onExit: () => void;
  isReviewSession: boolean;
}

const Flashcard: React.FC<{ verb: Verb; isFlipped: boolean; direction: TranslationDirection }> = ({ verb, isFlipped, direction }) => {
  const frontText = direction === TranslationDirection.FOREIGN_TO_POLISH ? verb.verb : verb.translation;
  const backText = direction === TranslationDirection.FOREIGN_TO_POLISH ? verb.translation : verb.verb;
  
  return (
    <div className="relative w-full h-64" style={{ perspective: '1000px' }}>
      <div
        className="relative w-full h-full transition-transform duration-500"
        style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
      >
        <div className="absolute w-full h-full bg-gray-800 rounded-xl flex items-center justify-center p-4" style={{ backfaceVisibility: 'hidden' }}>
          <p className="text-4xl md:text-5xl font-bold text-center">{frontText}</p>
        </div>
        <div className="absolute w-full h-full bg-blue-600 rounded-xl flex items-center justify-center p-4" style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}>
          <p className="text-4xl md:text-5xl font-bold text-center">{backText}</p>
        </div>
      </div>
    </div>
  );
};

const FlashcardView: React.FC<FlashcardViewProps> = ({ language, level, onSessionFinish, initialDeck, translationDirection, onExit, isReviewSession }) => {
  const [deck, setDeck] = useState<Verb[]>(initialDeck || []);
  const [isLoading, setIsLoading] = useState<boolean>(!initialDeck);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [knownWords, setKnownWords] = useState<Verb[]>([]);
  const [unknownWords, setUnknownWords] = useState<Verb[]>([]);
  
  useEffect(() => {
    if (initialDeck || !level) return;

    const fetchVerbs = async () => {
      try {
        setIsLoading(true);
        const verbs = await generateVerbs(language, level);
        const shuffledVerbs = verbs.sort(() => Math.random() - 0.5);
        setDeck(shuffledVerbs);
        setError(null);
      } catch (err) {
        setError('Nie udało się załadować słówek. Spróbuj ponownie później.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVerbs();
  }, [language, level, initialDeck]);

  const handleAnswer = useCallback((knows: boolean) => {
    if (isAnswered) return;

    setIsAnswered(true);
    const currentVerb = deck[currentIndex];
    
    const nextKnownWords = knows ? [...knownWords, currentVerb] : knownWords;
    const nextUnknownWords = knows ? unknownWords : [...unknownWords, currentVerb];
    
    if (knows) {
      setKnownWords(nextKnownWords);
    } else {
      setUnknownWords(nextUnknownWords);
    }

    setIsFlipped(true);

    setTimeout(() => {
      if (currentIndex + 1 < deck.length) {
        setIsFlipped(false);
        setTimeout(() => {
          setCurrentIndex(prev => prev + 1);
          setIsAnswered(false);
        }, 250);
      } else {
        onSessionFinish(nextUnknownWords, nextKnownWords);
      }
    }, 2000);
  }, [currentIndex, deck, isAnswered, onSessionFinish, knownWords, unknownWords]);

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
  const sessionTitle = isReviewSession ? "Sesja powtórkowa" : `Poziom ${level}`;

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto">
      <button onClick={onExit} className="absolute top-0 -left-16 text-gray-400 hover:text-white transition-colors hidden md:block" aria-label="Przerwij sesję">
        <ArrowLeftIcon className="w-8 h-8"/>
      </button>
      <div className="w-full mb-6">
        <div className="flex justify-between items-center text-gray-400 mb-1">
          <span>{sessionTitle}</span>
          <span>{`${currentIndex + 1} / ${deck.length}`}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.3s ease-in-out' }}></div>
        </div>
      </div>
      
      <Flashcard verb={currentVerb} isFlipped={isFlipped} direction={translationDirection} />

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
      
      <button onClick={onExit} className="md:hidden mt-8 text-gray-400 hover:text-white transition-colors underline">
        Przerwij sesję
      </button>
    </div>
  );
};

export default FlashcardView;
