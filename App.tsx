import React, { useState, useCallback } from 'react';
import { Language, Level, View, Verb, TranslationDirection } from './types';
import * as storage from './services/storageService';
import LanguageSelector from './components/LanguageSelector';
import LevelSelector from './components/LevelSelector';
import DirectionSelector from './components/DirectionSelector';
import FlashcardView from './components/FlashcardView';
import ReviewView from './components/ReviewView';

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.LANGUAGE_SELECTION);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [translationDirection, setTranslationDirection] = useState<TranslationDirection | null>(null);
  const [wordsToReview, setWordsToReview] = useState<Verb[]>([]);
  const [isReviewSession, setIsReviewSession] = useState<boolean>(false);

  const handleLanguageSelect = useCallback((language: Language) => {
    setSelectedLanguage(language);
    setView(View.LEVEL_SELECTION);
  }, []);

  const handleLevelSelect = useCallback((level: Level) => {
    setSelectedLevel(level);
    setIsReviewSession(false);
    setWordsToReview([]);
    setView(View.DIRECTION_SELECTION);
  }, []);

  const handleStartReview = useCallback(() => {
    if (!selectedLanguage) return;
    const unknownWords = storage.getUnknownWords(selectedLanguage);
    if (unknownWords.length > 0) {
      setWordsToReview(unknownWords);
      setIsReviewSession(true);
      setSelectedLevel(null);
      setView(View.DIRECTION_SELECTION);
    }
  }, [selectedLanguage]);

  const handleDirectionSelect = useCallback((direction: TranslationDirection) => {
    setTranslationDirection(direction);
    setView(View.FLASHCARDS);
  }, []);

  const handleSessionFinish = useCallback((sessionUnknownWords: Verb[], sessionKnownWords: Verb[]) => {
    if (selectedLanguage) {
      storage.addUnknownWords(selectedLanguage, sessionUnknownWords);
      if (isReviewSession) {
        storage.removeKnownWords(selectedLanguage, sessionKnownWords);
      }
    }
    
    setWordsToReview(sessionUnknownWords);
    if (sessionUnknownWords.length > 0) {
      setView(View.REVIEW);
    } else {
      setView(View.LEVEL_SELECTION);
    }
  }, [selectedLanguage, isReviewSession]);
  
  const handleStartNewSession = useCallback(() => {
    setSelectedLevel(null);
    setWordsToReview([]);
    setIsReviewSession(false);
    setView(View.LEVEL_SELECTION);
  }, []);

  const handleBackToLanguageSelection = useCallback(() => {
    setSelectedLanguage(null);
    setSelectedLevel(null);
    setWordsToReview([]);
    setIsReviewSession(false);
    setView(View.LANGUAGE_SELECTION);
  }, []);

  const handleBackToLevelSelection = useCallback(() => {
      setSelectedLevel(null);
      setTranslationDirection(null);
      setWordsToReview([]);
      setIsReviewSession(false);
      setView(View.LEVEL_SELECTION);
  }, []);
  
  const handleReview = useCallback(() => {
    setIsReviewSession(true);
    setView(View.DIRECTION_SELECTION);
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
        return <LevelSelector 
          onSelect={handleLevelSelect} 
          onBack={handleBackToLanguageSelection} 
          language={selectedLanguage}
          onStartReview={handleStartReview}
        />;
      case View.DIRECTION_SELECTION:
        if (!selectedLanguage) {
            setView(View.LANGUAGE_SELECTION);
            return null;
        }
        return <DirectionSelector 
          language={selectedLanguage}
          onSelect={handleDirectionSelect}
          onBack={handleBackToLevelSelection}
        />;
      case View.FLASHCARDS:
        if (!selectedLanguage || !translationDirection || (!selectedLevel && !isReviewSession)) {
            setView(View.LANGUAGE_SELECTION);
            return null;
        }
        const deck = wordsToReview.length > 0 ? wordsToReview.sort(() => Math.random() - 0.5) : undefined;
        return <FlashcardView 
          language={selectedLanguage} 
          level={selectedLevel}
          onSessionFinish={handleSessionFinish} 
          initialDeck={deck} 
          translationDirection={translationDirection}
          onExit={handleBackToLevelSelection}
          isReviewSession={isReviewSession}
        />;
      case View.REVIEW:
        return <ReviewView unknownWords={wordsToReview} onReview={handleReview} onNewSession={handleStartNewSession} />;
      default:
        return <LanguageSelector onSelect={handleLanguageSelect} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto relative">
        {renderView()}
      </div>
    </div>
  );
};

export default App;
