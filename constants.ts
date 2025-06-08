
import { Language, TranslationMode, TranslationStyle } from './types';

// The 'kingfall-ab-test' model is specified as the highest quality default.
// If it has a known public API alias like a gemini-x.x-flash/pro variant, that could be used.
// For now, we'll use the name as provided.
export const DEFAULT_HIGH_QUALITY_MODEL_ID = 'gemini-2.5-pro-preview-06-05'; 
// Fallback if kingfall-ab-test is not a recognized public model or for general use:
// export const DEFAULT_HIGH_QUALITY_MODEL_ID = 'gemini-2.5-flash-preview-04-17';


export const TRANSLATION_MODES: TranslationMode[] = [
  {
    id: 'quality',
    name: 'Highest Quality',
    modelId: DEFAULT_HIGH_QUALITY_MODEL_ID,
    description: 'Prioritizes the most accurate and nuanced translation. (Default)',
    // For pro models, thinkingConfig is not applicable.
    // For flash models, omitting thinkingConfig enables thinking.
  },
  {
    id: 'balanced',
    name: 'Balanced',
    modelId: 'gemini-2.5-flash-preview-05-20', // Same model as Speedy
    description: 'A good balance between translation quality and speed.',
    // config is omitted, so thinking is enabled by default for this flash model.
  },
  {
    id: 'speedy',
    name: 'Speedy',
    modelId: 'gemini-2.5-flash-preview-05-20',
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
