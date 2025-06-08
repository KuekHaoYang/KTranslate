
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { 
    SUPPORTED_LANGUAGES, 
    TRANSLATION_MODES, 
    DEFAULT_TRANSLATION_MODE_ID, 
    AUTO_DETECT_LANG_CODE,
    DEFAULT_TRANSLATION_STYLE_ID,
    TRANSLATION_STYLES
} from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY environment variable is not set. Translation service will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY || "MISSING_API_KEY" });

export async function translateText(
  text: string,
  sourceLangCode: string,
  targetLangCode: string,
  translationModeId: string = DEFAULT_TRANSLATION_MODE_ID,
  translationStyleId: string = DEFAULT_TRANSLATION_STYLE_ID 
): Promise<string> {
  if (!API_KEY) {
    throw new Error("API_KEY is not configured. Cannot perform translation.");
  }
  if (!text.trim()) {
    return ""; // No need to call API for empty text
  }

  const selectedMode = TRANSLATION_MODES.find(mode => mode.id === translationModeId) || 
                       TRANSLATION_MODES.find(mode => mode.id === DEFAULT_TRANSLATION_MODE_ID)!;
  
  const selectedStyle = TRANSLATION_STYLES.find(style => style.id === translationStyleId) ||
                        TRANSLATION_STYLES.find(style => style.id === DEFAULT_TRANSLATION_STYLE_ID)!;

  const targetLanguage = SUPPORTED_LANGUAGES.find(lang => lang.code === targetLangCode)?.name || targetLangCode;
  
  let styleInstruction: string;
  if (selectedStyle.id === 'literal') {
    styleInstruction = "Provide a standard, literal translation. Focus on conveying the direct meaning accurately.";
  } else { // 'natural' or default
    styleInstruction = `Your translation should be colloquial and evocative, capturing the essence of a native speaker’s speech. Avoid a mechanical, literal translation. Instead, employ idiomatic expressions and natural phrasing that resonate with a native speaker of ${targetLanguage}.`;
  }
  
  let prompt: string;

  if (sourceLangCode === AUTO_DETECT_LANG_CODE) {
    prompt = `Your task is to translate text. First, silently identify the language of the text provided below. Then, translate it into ${targetLanguage}.
${styleInstruction}
IMPORTANT: Your response MUST contain *only* the translated text. Do not include the original text, detected language, target language name, or any other explanatory text, preambles, or apologies.

Text to translate:
"${text}"`;
  } else {
    const sourceLanguage = SUPPORTED_LANGUAGES.find(lang => lang.code === sourceLangCode)?.name || sourceLangCode;
    prompt = `Your task is to translate text. Translate the text provided below from ${sourceLanguage} into ${targetLanguage}.
${styleInstruction}
IMPORTANT: Your response MUST contain *only* the translated text. Do not include the original text, source language name, target language name, or any other explanatory text, preambles, or apologies.

Text to translate:
"${text}"`;
  }

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: selectedMode.modelId,
      contents: prompt,
      ...(selectedMode.config ? { config: selectedMode.config } : {}),
    });
    
    const translatedText = response.text;
    if (typeof translatedText === 'string') {
      return translatedText.trim();
    }
    throw new Error("Invalid translation response format.");

  } catch (error) {
    console.error(`Gemini API error (Model: ${selectedMode.modelId}, Style: ${selectedStyle.name}):`, error);
    if (error instanceof Error) {
        if (error.message.includes("Could not find model")) {
             throw new Error(`Translation failed: The model '${selectedMode.modelId}' configured for '${selectedMode.name}' mode could not be found. Please check model availability.`);
        }
        throw new Error(`Translation failed (Mode: ${selectedMode.name}, Style: ${selectedStyle.name}): ${error.message}`);
    }
    throw new Error(`Translation failed (Mode: ${selectedMode.name}, Style: ${selectedStyle.name}) due to an unknown error.`);
  }
}
