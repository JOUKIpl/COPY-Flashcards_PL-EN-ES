import React, { useState, useCallback, useMemo } from 'react';
import LanguageSelector from './components/LanguageSelector';
import LevelSelector from './components/LevelSelector';
import DirectionSelector from './components/DirectionSelector';
import FlashcardView from './components/FlashcardView';
import ReviewView from './components/ReviewView';
import LoadingSpinner from './components/LoadingSpinner';
import CategorySelector from './components/CategorySelector';
import CustomWordsView from './components/CustomWordsView';
import { Language, Level, View, TranslationDirection, Word, WordCategory } from './types';
import { generateWords } from './services/geminiService';
import * as storage from './services/storageService';
import { CheckIcon } from './components/icons';

const BLOCK_SIZE = 25;

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.LANGUAGE_SELECTION);
  const [language, setLanguage] = useState<Language | null>(null);
  const [level, setLevel] = useState<Level | null>(null);
  const [category, setCategory] = useState<WordCategory | null>(null);
  const [direction, setDirection] = useState<TranslationDirection | null>(null);
  const [fullWordList, setFullWordList] = useState<Word[]>([]);
  const [blockIndex, setBlockIndex] = useState<number>(0);
  const [reviewWords, setReviewWords] = useState<Word[]>([]);
  const [blockSummary, setBlockSummary] = useState<{ known: number, unknown: number } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleLanguageSelect = (selectedLanguage: Language) => {
    setLanguage(selectedLanguage);
    setView(View.LEVEL_SELECTION);
  };

  const handleLevelSelect = (selectedLevel: Level) => {
    setLevel(selectedLevel);
    setView(View.CATEGORY_SELECTION);
  };
  
  const handleCategorySelect = (selectedCategory: WordCategory) => {
    setCategory(selectedCategory);
    setView(View.DIRECTION_SELECTION);
  };

  const handleDirectionSelect = async (selectedDirection: TranslationDirection) => {
    if (!language || !level || !category) return;

    setDirection(selectedDirection);

    // If it's a custom session, words are already loaded. Skip API call.
    if (level === Level.CUSTOM) {
      setView(View.FLASHCARDS);
      return;
    }

    setIsLoading(true);
    setError(null);
    setFullWordList([]);
    setBlockIndex(0);

    try {
      const generatedWords = await generateWords(language, level, category);
      if (generatedWords.length === 0) {
        throw new Error("API nie zwróciło żadnych słów.");
      }
      setFullWordList(generatedWords);
      setView(View.FLASHCARDS);
    } catch (err) {
      console.error(err);
      setError('Nie udało się wygenerować fiszek. Spróbuj ponownie.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleStartReview = () => {
    if (!language) return;
    const wordsToReview = storage.getUnknownWords(language);
    if (wordsToReview.length > 0) {
      setReviewWords(wordsToReview);
      setView(View.REVIEW);
    } else {
      alert("Brak słówek do powtórzenia!");
    }
  };

  const handleCustomSelect = () => {
    setView(View.CUSTOM_WORDS_MANAGEMENT);
  };

  const handleStartCustomSession = () => {
    if (!language) return;
    const customWords = storage.getCustomWords(language);
    if (customWords.length === 0) {
      alert("Brak własnych fiszek do nauki!");
      return;
    }
    setFullWordList(customWords);
    setLevel(Level.CUSTOM);
    setCategory(WordCategory.CUSTOM);
    setBlockIndex(0);
    setBlockSummary(null);
    setView(View.DIRECTION_SELECTION);
  };

  const resetToLanguageSelection = useCallback(() => {
    setView(View.LANGUAGE_SELECTION);
    setLanguage(null);
    setLevel(null);
    setCategory(null);
    setDirection(null);
    setFullWordList([]);
    setReviewWords([]);
  }, []);

  const backToLevelSelection = useCallback(() => {
    setView(View.LEVEL_SELECTION);
    setLevel(null);
    setCategory(null);
    setDirection(null);
    setFullWordList([]);
    setError(null);
    setBlockSummary(null);
  }, []);
  
  const backToCategorySelection = useCallback(() => {
    setView(View.CATEGORY_SELECTION);
    setCategory(null);
    setDirection(null);
    setFullWordList([]);
    setError(null);
    setBlockSummary(null);
  }, []);

  const handleBlockComplete = (unknownWordsFromBlock: Word[]) => {
    if (language) {
      storage.addUnknownWords(language, unknownWordsFromBlock);
    }
    const knownCount = BLOCK_SIZE - unknownWordsFromBlock.length;
    setBlockSummary({ known: knownCount, unknown: unknownWordsFromBlock.length });
    setView(View.BLOCK_SUMMARY);
  };

  const handleContinue = () => {
    setBlockIndex(prev => prev + 1);
    setBlockSummary(null);
    setView(View.FLASHCARDS);
  };
  
  const currentDeck = useMemo(() => {
    if (level === Level.CUSTOM) {
      return fullWordList; // For custom words, the deck is the entire list
    }
    return fullWordList.slice(blockIndex * BLOCK_SIZE, (blockIndex + 1) * BLOCK_SIZE);
  }, [fullWordList, blockIndex, level]);

  const getSessionTitle = () => {
    if (level === Level.CUSTOM) {
      return "Własne fiszki";
    }
    return `Blok ${blockIndex + 1} / ${Math.ceil(fullWordList.length / BLOCK_SIZE)}`;
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <LoadingSpinner />
          <p className="text-white mt-4 text-lg">Generowanie fiszek przy użyciu Gemini...</p>
          <p className="text-white mt-2 text-sm text-gray-400">Może to potrwać chwilę.</p>
        </div>
      );
    }

    if (error) {
       return (
        <div className="flex flex-col items-center justify-center h-full text-white text-center">
          <p className="text-2xl text-red-400 mb-6">{error}</p>
          <button onClick={backToLevelSelection} className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105">
            Spróbuj ponownie
          </button>
        </div>
       );
    }

    switch (view) {
      case View.LANGUAGE_SELECTION:
        return <LanguageSelector onSelect={handleLanguageSelect} />;
      case View.LEVEL_SELECTION:
        if (!language) return null;
        return (
          <LevelSelector
            language={language}
            onSelect={handleLevelSelect}
            onBack={resetToLanguageSelection}
            onStartReview={handleStartReview}
            onSelectCustom={handleCustomSelect}
          />
        );
      case View.CATEGORY_SELECTION:
        if (!language || !level) return null;
        return (
          <CategorySelector
            language={language}
            level={level}
            onSelect={handleCategorySelect}
            onBack={backToLevelSelection}
          />
        );
      case View.DIRECTION_SELECTION:
        if (!language || !level || !category) return null;
        return (
          <DirectionSelector
            language={language}
            onSelect={handleDirectionSelect}
            onBack={backToCategorySelection}
          />
        );
      case View.FLASHCARDS:
        if (!language || !level || !direction || !category || currentDeck.length === 0) return null;
        return (
          <FlashcardView
            deck={currentDeck}
            language={language}
            level={level}
            category={category}
            direction={direction}
            onBlockComplete={handleBlockComplete}
            onSessionInterrupt={backToLevelSelection}
            sessionTitle={getSessionTitle()}
          />
        );
      case View.BLOCK_SUMMARY:
        if (!blockSummary) return null;
        const hasMoreBlocks = (blockIndex + 1) * BLOCK_SIZE < fullWordList.length;
        return (
           <div className="flex flex-col items-center justify-center h-full text-center">
            <CheckIcon className="w-16 h-16 text-green-400 mb-4" />
            <h2 className="text-3xl font-bold mb-2 text-white">Blok ukończony!</h2>
            <p className="text-xl mb-8 text-gray-300">Dodano {blockSummary.unknown} słówek do powtórki.</p>
            <div className="flex flex-col md:flex-row gap-4">
              {hasMoreBlocks && (
                <button
                  onClick={handleContinue}
                  className="bg-gradient-to-br from-blue-500 to-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-transform transform hover:scale-105"
                >
                  Kontynuuj naukę
                </button>
              )}
              <button
                onClick={backToLevelSelection}
                className="bg-gradient-to-br from-gray-600 to-gray-700 text-white font-bold py-3 px-8 rounded-lg transition-transform transform hover:scale-105"
              >
                {hasMoreBlocks ? 'Zakończ sesję' : 'Zakończ'}
              </button>
            </div>
          </div>
        );
      case View.REVIEW:
        if (!language) return null;
        return (
            <ReviewView 
                reviewWords={reviewWords}
                language={language}
                onFinish={backToLevelSelection}
            />
        );
      case View.CUSTOM_WORDS_MANAGEMENT:
        if (!language) return null;
        return (
          <CustomWordsView
            language={language}
            onBack={backToLevelSelection}
            onStart={handleStartCustomSession}
          />
        );
      default:
        return <LanguageSelector onSelect={handleLanguageSelect} />;
    }
  };

  return (
    <main className="bg-gray-900 text-white min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 md:p-8">
       <div className="w-full max-w-4xl h-[90vh] md:h-[80vh] relative">
          {renderContent()}
       </div>
    </main>
  );
};

export default App;