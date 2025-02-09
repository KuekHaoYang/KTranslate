import { useState, useEffect, useRef, useCallback } from 'react';
import { useAPIConfig } from '@/context/APIConfigContext';
import { translateTextStream } from '@/lib/services/translationService';
import type { LanguageCode } from '@/lib/config/languages';

export function useTranslation() {
  const { config } = useAPIConfig();
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState<LanguageCode>('auto-detect');
  const [targetLang, setTargetLang] = useState<LanguageCode>('en');
  const [translateState, setTranslateState] = useState('default');
  const [error, setError] = useState<string | null>(null);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const currentTranslationRef = useRef('');

  const handleTranslate = useCallback(async () => {
    const trimmedText = sourceText.trim();
    
    // Check API key first
    if (!config.apiKey) {
      setError('🔑 Please configure your API key in settings to start translating');
      setTranslatedText('⚙️ Click the settings icon in the top right corner to set up your API key');
      return;
    }

    // Handle ongoing translation
    if (abortController) {
      abortController.abort();
      setAbortController(null);
      setTranslateState('default');
      return;
    }

    // If text is empty, set appropriate message
    if (!trimmedText) {
      setTranslatedText('✨ Ready to translate! Type or paste your text in the box above to get started');
      return;
    }

    setTranslateState('loading');
    setError(null);
    setTranslatedText('🔄 Translating...');
    currentTranslationRef.current = '';

    const controller = new AbortController();
    setAbortController(controller);

    try {
      await translateTextStream(
        trimmedText,
        targetLang,
        sourceLang,
        config,
        (chunk) => {
          currentTranslationRef.current += chunk;
          setTranslatedText(prev => {
            const cleanPrev = prev.startsWith('🔄') ? '' : (prev.endsWith('...') ? prev.slice(0, -3) : prev);
            return cleanPrev + chunk + '...';
          });
        },
        controller.signal
      );

      // Wait for a tick to ensure state is updated
      await new Promise(resolve => setTimeout(resolve, 0));

      // Get the final translation text and update state
      const finalTranslation = currentTranslationRef.current;
      setTranslatedText(finalTranslation);
      
      // Save to history after successful translation
      try {
        const savedTranslations = localStorage.getItem('translationHistory');
        const translations = savedTranslations ? JSON.parse(savedTranslations) : [];
        
        // Add new translation to history
        const newTranslation = {
          id: Date.now().toString(),
          sourceText: trimmedText,
          translatedText: finalTranslation,
          sourceLang,
          targetLang,
          timestamp: Date.now(),
          isFavorite: false
        };
        
        // Add to beginning of array
        translations.unshift(newTranslation);
        
        // Keep only the last 100 translations
        if (translations.length > 100) {
          translations.pop();
        }
        
        localStorage.setItem('translationHistory', JSON.stringify(translations));

        // Dispatch custom event to notify history panel
        window.dispatchEvent(new Event('translationHistoryUpdate'));
      } catch (error) {
        console.error('Failed to save translation to history:', error);
      }

      setTranslateState('default');
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        setTranslateState('default');
        return;
      }
      const errorMessage = err instanceof Error ? err.message : 'Translation failed';
      setError(`❌ ${errorMessage}`);
      setTranslatedText('🔧 Oops! Something went wrong with the translation. Please try again or check your settings');
      setTranslateState('default');
    } finally {
      setAbortController(null);
    }
  }, [sourceText, config, sourceLang, targetLang, abortController]);

  // Load saved language preferences on mount
  useEffect(() => {
    const savedSourceLang = localStorage.getItem('sourceLang');
    const savedTargetLang = localStorage.getItem('targetLang');
    
    if (savedSourceLang) {
      setSourceLang(savedSourceLang as LanguageCode);
    }
    if (savedTargetLang) {
      setTargetLang(savedTargetLang as LanguageCode);
    }
  }, []);

  // Save language preferences whenever they change
  useEffect(() => {
    localStorage.setItem('sourceLang', sourceLang);
  }, [sourceLang]);

  useEffect(() => {
    localStorage.setItem('targetLang', targetLang);
  }, [targetLang]);

  // Global keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Ctrl+Enter or Command+Enter
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault(); // Prevent default behavior
        handleTranslate();
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [sourceText, config, sourceLang, targetLang, handleTranslate]);

  const handleSwapLanguages = () => {
    if (sourceLang === 'auto-detect') return false;
    const tempLang = sourceLang;
    const tempText = sourceText;
    setSourceLang(targetLang);
    setTargetLang(tempLang);
    setSourceText(translatedText);
    setTranslatedText(tempText);
    return true;
  };

  return {
    sourceText,
    setSourceText,
    translatedText,
    setTranslatedText,
    sourceLang,
    setSourceLang,
    targetLang,
    setTargetLang,
    translateState,
    error,
    handleTranslate,
    handleSwapLanguages,
  };
} 