
import React, { useState, useCallback } from 'react';
import { Language } from '../types';
import { LanguageSelector } from './LanguageSelector';
import { CopyIcon } from './icons/CopyIcon';
import { ClearIcon } from './icons/ClearIcon';
import { LoadingSpinner } from './LoadingSpinner';
import { PasteIcon } from './icons/PasteIcon'; // Added PasteIcon

interface TranslationPanelProps {
  panelType: 'source' | 'target';
  label: string; 
  languageSelectorLabel: string;
  languages: Language[];
  selectedLanguage: string;
  onLanguageChange: (langCode: string) => void;
  text: string;
  onTextChange?: (text: string) => void;
  onClear?: () => void;
  onPaste?: () => Promise<void>; // Added onPaste prop
  placeholder: string;
  isLoading?: boolean;
  className?: string;
}

export const TranslationPanel: React.FC<TranslationPanelProps> = ({
  panelType,
  label,
  languageSelectorLabel,
  languages,
  selectedLanguage,
  onLanguageChange,
  text,
  onTextChange,
  onClear,
  onPaste, // Destructure onPaste
  placeholder,
  isLoading = false,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);
  const languageSelectorId = `${panelType}-lang-selector-main`;

  const handleCopy = useCallback(() => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [text]);

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onTextChange) {
      onTextChange(e.target.value);
    }
  };

  const isReadOnly = panelType === 'target';

  const copyButtonAriaLabel = copied
    ? (panelType === 'source' ? "Input copied!" : "Translation copied!")
    : (panelType === 'source' ? "Copy input text" : "Copy translated text");
  
  const copiedStatusDisplay = copied 
    ? <span className="text-xs font-medium text-primary dark:text-primary-light px-1">Copied!</span> 
    : <CopyIcon className="w-4.5 h-4.5" />;

  return (
    <div className={`flex flex-col p-4 sm:p-5 bg-lightCard dark:bg-darkCard rounded-2xl shadow-card transition-colors duration-250 ${className}`}>
      <div className="relative z-10 mb-3">
        <label 
          htmlFor={languageSelectorId} 
          className="block text-xs font-medium text-lightSubtleText dark:text-darkSubtleText mb-1.5 transition-colors duration-250"
        >
          {languageSelectorLabel}
        </label>
        <LanguageSelector
          mainId={languageSelectorId}
          label={null}
          languages={languages}
          selectedLanguage={selectedLanguage}
          onChange={onLanguageChange}
          disabled={isLoading}
          className="w-full"
        />
      </div>

      <div className="relative flex-grow">
        <label htmlFor={`${panelType}-textarea`} className="sr-only">
          {label}
        </label>
        <textarea
          id={`${panelType}-textarea`}
          value={text}
          onChange={handleTextAreaChange}
          readOnly={isReadOnly || isLoading}
          placeholder={isLoading && isReadOnly ? "Translating..." : placeholder}
          className="w-full h-full min-h-[12rem] sm:min-h-[14rem] md:min-h-[16rem] p-3.5 resize-none bg-lightInputBg dark:bg-darkInputBg border border-lightBorder dark:border-darkBorder rounded-xl focus:outline-none focus:border-2 focus:border-primary dark:focus:border-primary-light transition-all duration-250 text-lightText dark:text-darkText placeholder-lightSubtleText dark:placeholder-darkSubtleText disabled:opacity-60 text-base"
          aria-label={`${label} text area`}
          disabled={isLoading && panelType === 'source'}
        />
        {isLoading && isReadOnly && (
          <div className="absolute inset-0 flex items-center justify-center bg-lightInputBg/50 dark:bg-darkInputBg/50 rounded-xl">
            <LoadingSpinner size="md" colorClass="text-primary"/>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mt-2.5 text-xs text-lightSubtleText dark:text-darkSubtleText">
        {panelType === 'source' && (
          <span></span> 
        )}
        {panelType === 'target' && <span className="flex-grow"></span>}
        
        <div className="flex items-center space-x-1">
          {panelType === 'source' && onPaste && (
            <button
              onClick={onPaste}
              disabled={isLoading}
              className="p-1.5 rounded-lg text-lightSubtleText dark:text-darkSubtleText hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              aria-label="Paste text from clipboard"
            >
              <PasteIcon className="w-4.5 h-4.5" />
            </button>
          )}

          {onClear && (
            <button
              onClick={onClear}
              disabled={!text || isLoading}
              className="p-1.5 rounded-lg text-lightSubtleText dark:text-darkSubtleText hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              aria-label={panelType === 'source' ? "Clear input text" : "Clear translated text"}
            >
              <ClearIcon className="w-4.5 h-4.5" />
            </button>
          )}
          
          <button
            onClick={handleCopy}
            disabled={!text || isLoading}
            className="p-1.5 rounded-lg text-lightSubtleText dark:text-darkSubtleText hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            aria-label={copyButtonAriaLabel}
          >
            {copiedStatusDisplay}
          </button>
        </div>
      </div>
    </div>
  );
};
