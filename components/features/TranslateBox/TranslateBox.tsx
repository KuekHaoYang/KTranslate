'use client';

import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { LanguageSection } from './components/LanguageSection';
import { IconButton } from './components/IconButton';
import { useTranslation } from './hooks/useTranslation';
import { useClipboard } from './hooks/useClipboard';
import type { LanguageCode } from '@/lib/config/languages';
import { LANGUAGES } from '@/lib/config/languages';

export default function TranslateBox() {
  const [isLoading, setIsLoading] = useState(true);
  const [swapState, setSwapState] = useState('default');
  const textAnimation = useAnimation();
  const [sourceLangInputMode, setSourceLangInputMode] = useState<'dropdown' | 'text'>('dropdown');
  const [targetLangInputMode, setTargetLangInputMode] = useState<'dropdown' | 'text'>('dropdown');
  const [sourceLangText, setSourceLangText] = useState('');
  const [targetLangText, setTargetLangText] = useState('');

  // Load saved input mode states
  useEffect(() => {
    const savedSourceMode = localStorage.getItem('sourceLangInputMode');
    const savedTargetMode = localStorage.getItem('targetLangInputMode');
    if (savedSourceMode === 'text') {
      setSourceLangInputMode('text');
    }
    if (savedTargetMode === 'text') {
      setTargetLangInputMode('text');
    }
  }, []);

  // Save input mode states whenever they change
  useEffect(() => {
    localStorage.setItem('sourceLangInputMode', sourceLangInputMode);
  }, [sourceLangInputMode]);

  useEffect(() => {
    localStorage.setItem('targetLangInputMode', targetLangInputMode);
  }, [targetLangInputMode]);

  const {
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
  } = useTranslation();

  const {
    sourceCopyState,
    setSourceCopyState,
    targetCopyState,
    setTargetCopyState,
    sourcePasteState,
    setSourcePasteState,
    handleCopy,
    handlePaste
  } = useClipboard();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (translatedText) {
      textAnimation.start({
        opacity: [0.5, 1],
        transition: { duration: 0.2 }
      });
    }
  }, [translatedText, textAnimation]);

  const handleSwap = () => {
    const success = handleSwapLanguages();
    if (success) {
      setSwapState('success');
      setTimeout(() => setSwapState('default'), 2000);
    }
  };

  const handleClear = (isSource: boolean) => {
    if (isSource) {
      setSourceText('');
    } else {
      setTranslatedText('');
    }
  };

  const handlePasteText = async (setIconState: (state: string) => void) => {
    const text = await handlePaste(setIconState);
    setSourceText(text);
  };

  const detectLanguageFromText = (text: string): LanguageCode | undefined => {
    const normalizedText = text.toLowerCase().trim();
    
    // First try to match with predefined languages
    const predefinedLang = LANGUAGES.find(lang => 
      lang.name.toLowerCase() === normalizedText || 
      lang.code.toLowerCase() === normalizedText
    );

    if (predefinedLang) {
      return predefinedLang.code;
    }

    // If no predefined match found, return the input text as is
    // This will be used directly in the translation prompt
    return normalizedText || undefined;
  };

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-3xl mx-auto"
      >
        <div className="flex flex-col gap-4">
          <LanguageSection
            isSource={true}
            lang={sourceLang}
            setLang={setSourceLang}
            text={sourceText}
            setText={setSourceText}
            inputMode={sourceLangInputMode}
            setInputMode={setSourceLangInputMode}
            langText={sourceLangText}
            setLangText={setSourceLangText}
            handleCopy={handleCopy}
            handlePaste={handlePasteText}
            handleClear={handleClear}
            copyState={sourceCopyState}
            setCopyState={setSourceCopyState}
            pasteState={sourcePasteState}
            setPasteState={setSourcePasteState}
            detectLanguageFromText={detectLanguageFromText}
          />

          <div className="flex justify-center -my-2 relative z-10">
            <IconButton
              onClick={handleSwap}
              iconState={swapState}
              type="swap"
            />
          </div>

          <LanguageSection
            isSource={false}
            lang={targetLang}
            setLang={setTargetLang}
            text={translatedText}
            setText={setTranslatedText}
            inputMode={targetLangInputMode}
            setInputMode={setTargetLangInputMode}
            langText={targetLangText}
            setLangText={setTargetLangText}
            handleCopy={handleCopy}
            handleClear={handleClear}
            copyState={targetCopyState}
            setCopyState={setTargetCopyState}
            detectLanguageFromText={detectLanguageFromText}
          />

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <motion.div className="flex justify-center mt-4">
            <IconButton
              onClick={handleTranslate}
              iconState={translateState}
              type="translate"
            />
          </motion.div>
        </div>
      </motion.div>
    </>
  );
} 