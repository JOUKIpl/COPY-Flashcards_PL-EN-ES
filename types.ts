export enum Language {
  ENGLISH = 'Angielski',
  SPANISH = 'Hiszpański',
}

export enum Level {
  A1 = 'A1',
  A2 = 'A2',
  B1 = 'B1',
  B2 = 'B2',
  C1 = 'C1',
  C2 = 'C2',
  CUSTOM = 'Własne',
}

export enum WordCategory {
  NOUN = 'Rzeczowniki',
  ADJECTIVE = 'Przymiotniki',
  VERB = 'Czasowniki',
  NUMERAL = 'Liczebniki',
  PRONOUN = 'Zaimki',
  ADVERB = 'Przysłówki',
  PREPOSITION = 'Przyimki',
  CONJUNCTION = 'Spójniki',
  INTERJECTION = 'Wykrzykniki',
  PARTICLE = 'Partykuły',
  CUSTOM = 'Własne',
}

export enum View {
  LANGUAGE_SELECTION = 'language_selection',
  LEVEL_SELECTION = 'level_selection',
  CATEGORY_SELECTION = 'category_selection',
  DIRECTION_SELECTION = 'direction_selection',
  FLASHCARDS = 'flashcards',
  REVIEW = 'review',
  BLOCK_SUMMARY = 'block_summary',
  CUSTOM_WORDS_MANAGEMENT = 'custom_words_management',
}

export enum TranslationDirection {
  FOREIGN_TO_POLISH = 'foreign_to_polish',
  POLISH_TO_FOREIGN = 'polish_to_foreign',
}

export interface Word {
  word: string;
  translation: string;
}
