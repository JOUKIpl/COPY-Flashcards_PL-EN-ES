import { Language } from '../types';

const languageToLangCode = (language: Language): string => {
  switch (language) {
    case Language.ENGLISH:
      return 'en';
    case Language.SPANISH:
      return 'es';
    default:
      return 'en';
  }
};

// A simple cache for voices to avoid repeatedly calling getVoices()
let voices: SpeechSynthesisVoice[] = [];
const getVoices = (): SpeechSynthesisVoice[] => {
    if (voices.length === 0 && window.speechSynthesis) {
        voices = window.speechSynthesis.getVoices();
    }
    return voices;
};

// Ensure voices are loaded, as it can be asynchronous
if (typeof window !== 'undefined' && window.speechSynthesis && window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = () => {
        voices = window.speechSynthesis.getVoices();
    };
}

export const speak = (text: string, language: Language) => {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    console.error("Text-to-speech not supported in this browser.");
    alert("Twoja przeglądarka nie wspiera funkcji wymowy.");
    return;
  }

  // Cancel any ongoing speech to prevent overlap
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const langCode = languageToLangCode(language);
  
  utterance.lang = langCode;

  // Attempt to find a suitable voice
  const availableVoices = getVoices();
  let selectedVoice = availableVoices.find(voice => voice.lang.startsWith(langCode) && voice.name.includes('Google'));
  if (!selectedVoice) {
    selectedVoice = availableVoices.find(voice => voice.lang.startsWith(langCode));
  }

  if (selectedVoice) {
    utterance.voice = selectedVoice;
  } else {
     console.warn(`No voice found for language: ${langCode}. Using browser default.`);
  }

  utterance.pitch = 1;
  utterance.rate = 0.9;
  utterance.volume = 1;

  window.speechSynthesis.speak(utterance);
};
