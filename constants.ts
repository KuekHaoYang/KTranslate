
import { Language, TranslationMode, TranslationStyle } from './types';

// The 'gemini-2.5-pro-preview-06-05' model is specified as the highest quality default.
export const DEFAULT_HIGH_QUALITY_MODEL_ID = 'gemini-2.5-pro'; 


export const TRANSLATION_MODES: TranslationMode[] = [
  {
    id: 'quality',
    name: 'Highest Quality',
    modelId: DEFAULT_HIGH_QUALITY_MODEL_ID, // Uses gemini-2.5-pro-preview-06-05
    description: 'Prioritizes the most accurate and nuanced translation. (Default)',
    // For pro models, thinkingConfig is not applicable.
  },
  {
    id: 'balanced',
    name: 'Balanced',
    modelId: 'gemini-2.5-flash', // Uses a flash model, thinking enabled by default
    description: 'A good balance between translation quality and speed.',
    // config is omitted, so thinking is enabled by default for this flash model.
  },
  {
    id: 'speedy',
    name: 'Speedy',
    modelId: 'gemini-2.5-flash-lite-preview-06-17', // Uses the new flash-lite model
    description: 'Optimized for speed. Good for quick translations.',
    config: { thinkingConfig: { thinkingBudget: 0 } }, // Explicitly disable thinking
  },
];

export const DEFAULT_TRANSLATION_MODE_ID = 'quality';

export const TRANSLATION_STYLES: TranslationStyle[] = [
  {
    id: 'natural',
    name: 'Natural & Fluid',
    description: 'Colloquial, evocative, idiomatic. Sounds like a native speaker. (Default)',
  },
  {
    id: 'literal',
    name: 'Standard & Literal',
    description: 'Direct, precise, word-for-word. Focus on formal accuracy.',
  }
];

export const DEFAULT_TRANSLATION_STYLE_ID = 'natural';


export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese (Simplified)'},
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
];

export const AUTO_DETECT_LANG_CODE = 'auto';
export const DEFAULT_SOURCE_LANG_CODE = AUTO_DETECT_LANG_CODE; // Changed from 'en'
export const DEFAULT_TARGET_LANG_CODE = 'en';

export const AUTO_DETECT_LANGUAGE: Language = { code: AUTO_DETECT_LANG_CODE, name: 'Auto-detect' };

// For the source panel - includes "Auto-detect"
export const SOURCE_LANGUAGES_WITH_AUTO: Language[] = [
  AUTO_DETECT_LANGUAGE,
  ...SUPPORTED_LANGUAGES
];

// For the target panel - does not include "Auto-detect"
export const TARGET_LANGUAGES: Language[] = [...SUPPORTED_LANGUAGES];

export const MAX_HISTORY_ITEMS = 50;


// TEXT_AREA_MAX_LENGTH has been removed.