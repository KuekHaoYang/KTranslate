
export interface Language {
  code: string;
  name: string;
}

export enum Theme {
  Light = "light",
  Dark = "dark",
}

export interface TranslationMode {
  id: string; // e.g., 'quality', 'balanced', 'speedy'
  name: string; // User-facing name, e.g., "Highest Quality"
  description: string; // Short description for clarity
  modelId: string; // Actual Gemini model ID
  config?: Record<string, any>; // Model-specific configuration
}

export interface TranslationStyle {
  id: string; // e.g., 'natural', 'literal'
  name: string; // User-facing name, e.g., "Natural & Fluid"
  description: string; // Short description for clarity
}

export interface TranslationHistoryItem {
  id: string;
  timestamp: number;
  inputText: string;
  outputText: string;
  sourceLangCode: string;
  targetLangCode: string;
  sourceLangName: string;
  targetLangName: string;
  modeId: string;
  styleId: string;
}
