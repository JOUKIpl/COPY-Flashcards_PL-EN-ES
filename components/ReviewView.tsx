import React, { useState, useEffect } from 'react';
import { Verb, Language, TranslationDirection } from '../types';
import * as storage from '../services/storageService';
import { XIcon, CheckIcon, ArrowLeftIcon, SpeakerIcon } from './icons';
import { speak } from '../services/ttsService';

interface ReviewViewProps {
  reviewWords: Verb[];
  language: Language;
  onFinish: () => void;
}

const ReviewView: React.FC<ReviewViewProps> = ({ reviewWords, language, onFinish }) => {
  const [deck, setDeck] = useState<Verb[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownInSession, setKnownInSession] = useState<Verb[]>([]);
  const [stillUnknown, setStillUnknown] = useState<Verb[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction] = useState<TranslationDirection>(TranslationDirection.FOREIGN_TO_POLISH);

  useEffect(() => {
    // Shuffle the initial deck
    setDeck([...reviewWords].sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
    setIsFlipped(false);
    setKnownInSession([]);
    setStillUnknown([]);
    setIsTransitioning(false);
  }, [reviewWords]);

  const finishReview = (completed: boolean = false, allKnownWords: Verb[] = knownInSession) => {
    storage.removeKnownWords(language, allKnownWords);
    onFinish();
  };

  const handleAnswer = (known: boolean) => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    const currentVerb = deck[currentIndex];

    setIsFlipped(true);
    
    setTimeout(() => {
      let updatedKnownInSession = knownInSession;
      let updatedStillUnknown = stillUnknown;

      if (known) {
        updatedKnownInSession = [...knownInSession, currentVerb];
        setKnownInSession(updatedKnownInSession);
      } else {
        updatedStillUnknown = [...stillUnknown, currentVerb];
        setStillUnknown(updatedStillUnknown);
      }

      setIsFlipped(false);

      setTimeout(() => {
        if (currentIndex < deck.length - 1) {
          setCurrentIndex(prev => prev + 1);
          setIsTransitioning(false);
        } else {
          // End of a pass
          if (updatedStillUnknown.length === 0) {
            // All words known, finish review.
            finishReview(true, updatedKnownInSession);
          } else {
            // Start next pass with unknown words
            setDeck([...updatedStillUnknown].sort(() => Math.random() - 0.5));
            setStillUnknown([]);
            setCurrentIndex(0);
            setIsTransitioning(false);
          }
        }
      }, 500); // Animation duration
    }, 1500); // Time to see translation
  };

  const handleManualFlip = () => {
    if (!isTransitioning) {
        setIsFlipped(prev => !prev);
    }
  };

  const handleSpeak = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevents the card from flipping
    const currentVerb = deck[currentIndex];
    if (currentVerb) {
      speak(currentVerb.verb, language);
    }
  };
  
  const currentVerb = deck[currentIndex];
  
  if (!currentVerb) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center">
            <CheckIcon className="w-16 h-16 text-green-400 mb-4" />
            <h2 className="text-3xl font-bold mb-2 text-white">Powtórka ukończona!</h2>
            <p className="text-xl mb-8 text-gray-300">Wszystkie słówka powtórzone.</p>
            <button
                onClick={() => finishReview(true)}
                className="bg-gradient-to-br from-blue-500 to-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-transform transform hover:scale-105"
            >
                Powrót
            </button>
        </div>
    );
  }

  const isPolishToForeign = direction === TranslationDirection.POLISH_TO_FOREIGN;
  const frontText = isPolishToForeign ? currentVerb.translation : currentVerb.verb;
  const backText = isPolishToForeign ? currentVerb.verb : currentVerb.translation;

  const totalWordsInPass = deck.length;
  const wordsRemainingInPass = totalWordsInPass - currentIndex;
  const totalWordsToReview = reviewWords.length;
  const wordsMastered = knownInSession.length;


  return (
    <div className="flex flex-col items-center justify-between h-full p-4 relative">
        <div className="w-full flex justify-between items-center text-gray-400 mb-4">
            <button onClick={() => finishReview(false)} className="hover:text-white transition-colors">
                <ArrowLeftIcon className="w-8 h-8"/>
            </button>
            <div className="text-center">
                <h2 className="text-xl font-bold text-white">Powtórka</h2>
                <p className="text-sm">{language}</p>
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
              <button onClick={handleSpeak} className="absolute bottom-4 right-4 text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10" aria-label="Odtwórz wymowę">
                <SpeakerIcon className="w-7 h-7" />
              </button>
            </div>
            {/* Back of card */}
            <div className="absolute w-full h-full backface-hidden bg-gradient-to-br from-green-600 to-green-800 rounded-2xl flex items-center justify-center p-6 shadow-lg transform rotate-y-180">
              <h3 className="text-4xl md:text-5xl font-bold text-white text-center">{backText}</h3>
            </div>
          </div>
        </div>
      </div>
      
      <div className="w-full flex flex-col items-center mt-4">
            <div className="w-full max-w-lg text-center mb-6">
                <p className="text-gray-300">Opanowane: {wordsMastered} / {totalWordsToReview}</p>
                <p className="text-gray-400 text-sm">Pozostało w tej turze: {wordsRemainingInPass}</p>
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

export default ReviewView;