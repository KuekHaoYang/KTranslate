
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { TranslationPanel } from './components/TranslationPanel';
import { LoadingSpinner } from './components/LoadingSpinner';
import { SwapIcon } from './components/icons/SwapIcon';
import { TranslateIcon } from './components/icons/TranslateIcon';
import { translateText } from './services/geminiService';
import { 
  SOURCE_LANGUAGES_WITH_AUTO,
  TARGET_LANGUAGES,
  DEFAULT_SOURCE_LANG_CODE, 
  DEFAULT_TARGET_LANG_CODE, 
  AUTO_DETECT_LANG_CODE,
  SUPPORTED_LANGUAGES, 
  DEFAULT_TRANSLATION_MODE_ID,
  DEFAULT_TRANSLATION_STYLE_ID,
  AUTO_DETECT_LANGUAGE
} from './constants';
import { useTranslationHistory } from './hooks/useTranslationHistory'; // New import
import { HistoryPanel } from './components/HistoryPanel'; // New import
import { TranslationHistoryItem } from './types'; // New import

const App: React.FC = () => {
  const [sourceLang, setSourceLang] = useState<string>(DEFAULT_SOURCE_LANG_CODE);
  const [targetLang, setTargetLang] = useState<string>(DEFAULT_TARGET_LANG_CODE);
  const [inputText, setInputText] = useState<string>('');
  const [outputText, setOutputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showApiKeyWarning, setShowApiKeyWarning] = useState<boolean>(false);
  const [selectedModeId, setSelectedModeId] = useState<string>(DEFAULT_TRANSLATION_MODE_ID);
  const [selectedStyleId, setSelectedStyleId] = useState<string>(DEFAULT_TRANSLATION_STYLE_ID);

  const [historyItems, addHistoryItem, removeHistoryItem, clearAllHistory] = useTranslationHistory();
  const [isHistoryPanelOpen, setIsHistoryPanelOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!process.env.API_KEY) {
      setShowApiKeyWarning(true);
    }
  }, []);

  const getLanguageNameByCode = useCallback((code: string): string => {
    if (code === AUTO_DETECT_LANG_CODE) return AUTO_DETECT_LANGUAGE.name;
    const lang = SUPPORTED_LANGUAGES.find(l => l.code === code);
    return lang ? lang.name : code; // fallback to code if name not found
  }, []);

  const handleTranslate = useCallback(async () => {
    if (!inputText.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setOutputText(''); 

    try {
      const translated = await translateText(inputText, sourceLang, targetLang, selectedModeId, selectedStyleId);
      setOutputText(translated);
      if (translated.trim()) { // Only add to history if translation is not empty
        addHistoryItem({
          inputText,
          outputText: translated,
          sourceLangCode: sourceLang,
          targetLangCode: targetLang,
          sourceLangName: getLanguageNameByCode(sourceLang),
          targetLangName: getLanguageNameByCode(targetLang),
          modeId: selectedModeId,
          styleId: selectedStyleId,
        });
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'An unknown error occurred during translation.');
      } else {
        setError('An unknown error occurred during translation.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [inputText, sourceLang, targetLang, isLoading, selectedModeId, selectedStyleId, addHistoryItem, getLanguageNameByCode]);

  const handleSwapLanguages = useCallback(() => {
    if (isLoading) return;
    const currentInput = inputText;
    const currentOutput = outputText;
    
    const newSourceLang = targetLang;
    let newTargetLang = sourceLang;

    if (newTargetLang === AUTO_DETECT_LANG_CODE) {
      if (newSourceLang !== DEFAULT_SOURCE_LANG_CODE) { // if newSourceLang is not auto (which it can't be as it's from targetLang)
        newTargetLang = DEFAULT_SOURCE_LANG_CODE; // Default to auto, or specific like 'en'
      } else { // This case should ideally not happen if targetLang cannot be auto
        newTargetLang = DEFAULT_TARGET_LANG_CODE; 
      }
      // Ensure target is not same as source if source is not auto
      if (newTargetLang === newSourceLang && newSourceLang !== AUTO_DETECT_LANG_CODE) { 
          const fallbackTarget = SUPPORTED_LANGUAGES.find(l => l.code !== newSourceLang && l.code !== AUTO_DETECT_LANG_CODE);
          if (fallbackTarget) {
              newTargetLang = fallbackTarget.code;
          } else if (SUPPORTED_LANGUAGES.length > 0 && SUPPORTED_LANGUAGES[0].code !== AUTO_DETECT_LANG_CODE && SUPPORTED_LANGUAGES[0].code !== newSourceLang) {
             newTargetLang = SUPPORTED_LANGUAGES.find(l => l.code !== AUTO_DETECT_LANG_CODE && l.code !== newSourceLang)?.code || SUPPORTED_LANGUAGES[0].code;
          } else {
            // This is a tricky state, implies very few languages and one of them is newSourceLang
            newTargetLang = DEFAULT_TARGET_LANG_CODE; // Fallback to overall default
          }
      }
    }
    
    setSourceLang(newSourceLang);
    setTargetLang(newTargetLang);
    setInputText(currentOutput); 

    if (currentOutput.trim() === '' && currentInput.trim() !== '') {
         setOutputText('');
    } else {
         setOutputText(currentInput); 
    }
  }, [sourceLang, targetLang, inputText, outputText, isLoading]);

  const handleClearInput = useCallback(() => {
    setInputText('');
    setOutputText(''); 
    setError(null);
  }, []);

  const handleClearOutputText = useCallback(() => {
    if (isLoading) return;
    setOutputText('');
  }, [isLoading]);

  const handlePasteFromClipboard = useCallback(async () => {
    if (isLoading) return;
    try {
      const clipboardText = await navigator.clipboard.readText();
      setInputText(clipboardText); 
      setError(null); 
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
      setError('Failed to paste from clipboard. Please ensure you have granted permission if prompted.');
    }
  }, [isLoading]);

  const handleInputTextChange = (text: string) => {
    setInputText(text);
  };

  const toggleHistoryPanel = useCallback(() => {
    setIsHistoryPanelOpen(prev => !prev);
  }, []);

  const loadFromHistoryItem = useCallback((item: TranslationHistoryItem) => {
    setInputText(item.inputText);
    setOutputText(item.outputText);
    setSourceLang(item.sourceLangCode);
    setTargetLang(item.targetLangCode);
    setSelectedModeId(item.modeId);
    setSelectedStyleId(item.styleId);
    setError(null);
    setIsHistoryPanelOpen(false); // Close panel after loading
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-lightBg dark:bg-darkBg text-lightText dark:text-darkText transition-colors duration-250 font-sans antialiased">
      <Header 
        selectedModeId={selectedModeId}
        onModeChange={setSelectedModeId}
        selectedStyleId={selectedStyleId}
        onStyleChange={setSelectedStyleId}
        isTranslationLoading={isLoading}
        onToggleHistoryPanel={toggleHistoryPanel} // Pass handler
      />
      
      {showApiKeyWarning && (
        <div className="bg-yellow-500/10 border-l-4 border-yellow-500 text-yellow-700 dark:text-yellow-400 dark:bg-yellow-400/10 dark:border-yellow-300 p-3.5 mx-4 sm:mx-6 mt-4 rounded-lg shadow-subtle" role="alert">
          <p className="font-semibold text-sm">API Key Missing</p>
          <p className="text-xs">The <code>API_KEY</code> environment variable is not set. Translations will not function.</p>
        </div>
      )}

      <main className="flex-grow container mx-auto px-4 py-5 sm:px-6 sm:py-6 md:py-8 flex flex-col">
        <div className="w-full max-w-3xl mx-auto space-y-5 sm:space-y-6 md:space-y-6 flex flex-col flex-grow"> 
          
          <TranslationPanel
            panelType="source"
            label="Translate From" 
            languageSelectorLabel="Source Language" 
            languages={SOURCE_LANGUAGES_WITH_AUTO}
            selectedLanguage={sourceLang}
            onLanguageChange={setSourceLang}
            text={inputText}
            onTextChange={handleInputTextChange}
            onClear={handleClearInput}
            onPaste={handlePasteFromClipboard}
            placeholder="Enter text..."
            isLoading={isLoading}
            className="animate-fadeIn flex-grow"
          />
          
          <div className="flex flex-row items-center justify-center gap-3 py-2">
            <button
              onClick={handleSwapLanguages}
              disabled={isLoading}
              className="h-11 w-11 flex items-center justify-center p-0 bg-lightCard dark:bg-darkCard rounded-full shadow-card hover:bg-lightInputBg dark:hover:bg-darkInputBg text-primary dark:text-primary-light disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-3 focus-visible:ring-light dark:focus-visible:ring-dark focus-visible:ring-offset-2 focus-visible:ring-offset-lightBg dark:focus-visible:ring-offset-darkBg"
              aria-label="Swap languages and text"
            >
              <SwapIcon className="w-5 h-5" />
            </button>
            
            <button
              onClick={handleTranslate}
              disabled={isLoading || !inputText.trim()}
              className="h-11 flex-1 min-w-[160px] px-6 bg-gradient-to-r from-interactiveGradientFrom to-interactiveGradientTo dark:from-darkInteractiveGradientFrom dark:to-darkInteractiveGradientTo text-white font-semibold rounded-xl shadow-interactive hover:shadow-interactive-hover focus:outline-none focus-visible:ring-3 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-lightBg dark:focus-visible:ring-offset-darkBg disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-subtle transition-all duration-250 transform hover:scale-102 active:scale-98 flex items-center justify-center text-base leading-none"
              aria-live="polite"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" colorClass="text-white" />
              ) : (
                <>
                  <TranslateIcon className="w-5 h-5 mr-2" />
                  Translate
                </>
              )}
            </button>
          </div>
           
          <TranslationPanel
            panelType="target"
            label="Translate To"
            languageSelectorLabel="Target Language"
            languages={TARGET_LANGUAGES}
            selectedLanguage={targetLang}
            onLanguageChange={setTargetLang}
            text={outputText}
            onClear={handleClearOutputText}
            placeholder="Translation..."
            isLoading={isLoading}
            className="animate-fadeIn flex-grow"
          />
        </div>

        {error && (
          <div className="w-full max-w-3xl mx-auto mt-6 p-3 bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-300 dark:bg-red-500/15 dark:border-red-400/30 rounded-lg text-xs text-center shadow-subtle transition-all duration-250 animate-fadeInUp" role="alert">
            <p><span className="font-semibold">Error:</span> {error}</p>
          </div>
        )}
      </main>

      <footer className="py-5 text-xs text-lightSubtleText dark:text-darkSubtleText mt-auto flex justify-center items-center">
        <p>
          <span className="inline-block px-3 py-1 rounded-full bg-lightBorder dark:bg-darkBorder">
            &copy; {new Date().getFullYear()} KTranslate. Powered by Gemini.
          </span>
        </p>
      </footer>

      <HistoryPanel
        isOpen={isHistoryPanelOpen}
        onClose={toggleHistoryPanel}
        historyItems={historyItems}
        onLoadItem={loadFromHistoryItem}
        onDeleteItem={removeHistoryItem}
        onClearAll={clearAllHistory}
      />
    </div>
  );
};

export default App;
