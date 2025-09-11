
import React, { useState, useCallback } from 'react';
import { Language, Level, View, Verb } from './types';
import LanguageSelector from './components/LanguageSelector';
import LevelSelector from './components/LevelSelector';
import FlashcardView from './components/FlashcardView';
import ReviewView from './components/ReviewView';

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.LANGUAGE_SELECTION);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [wordsToReview, setWordsToReview] = useState<Verb[]>([]);

  const handleLanguageSelect = useCallback((language: Language) => {
    setSelectedLanguage(language);
    setView(View.LEVEL_SELECTION);
  }, []);

  const handleLevelSelect = useCallback((level: Level) => {
    setSelectedLevel(level);
    setView(View.FLASHCARDS);
  }, []);

  const handleSessionFinish = useCallback((unknownWords: Verb[]) => {
    setWordsToReview(unknownWords);
    if (unknownWords.length > 0) {
      setView(View.REVIEW);
    } else {
      setView(View.LEVEL_SELECTION);
    }
  }, []);
  
  const handleStartNewSession = useCallback(() => {
    setSelectedLevel(null);
    setWordsToReview([]);
    setView(View.LEVEL_SELECTION);
  }, []);

  const handleBackToLanguageSelection = useCallback(() => {
    setSelectedLanguage(null);
    setSelectedLevel(null);
    setWordsToReview([]);
    setView(View.LANGUAGE_SELECTION);
  }, []);
  
  const handleReview = useCallback(() => {
    setView(View.FLASHCARDS);
  }, []);

  const renderView = () => {
    switch (view) {
      case View.LANGUAGE_SELECTION:
        return <LanguageSelector onSelect={handleLanguageSelect} />;
      case View.LEVEL_SELECTION:
        if (!selectedLanguage) {
            setView(View.LANGUAGE_SELECTION);
            return null;
        }
        return <LevelSelector onSelect={handleLevelSelect} onBack={handleBackToLanguageSelection} language={selectedLanguage} />;
      case View.FLASHCARDS:
        if (!selectedLanguage || !selectedLevel) {
            setView(View.LANGUAGE_SELECTION);
            return null;
        }
        const deck = wordsToReview.length > 0 ? wordsToReview : undefined;
        return <FlashcardView language={selectedLanguage} level={selectedLevel} onSessionFinish={handleSessionFinish} initialDeck={deck} />;
      case View.REVIEW:
        return <ReviewView unknownWords={wordsToReview} onReview={handleReview} onNewSession={handleStartNewSession} />;
      default:
        return <LanguageSelector onSelect={handleLanguageSelect} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto">
        {renderView()}
      </div>
    </div>
  );
};

export default App;
