import { motion } from 'framer-motion';
import { LanguageCode } from '@/lib/config/languages';
import LanguageSelect from '@/components/ui/LanguageSelect';
import { IconButton } from './IconButton';
import { LANGUAGES } from '@/lib/config/languages';
import { useAPIConfig } from '@/context/APIConfigContext';

// Helper function to find the closest matching language
function findClosestLanguage(input: string): LanguageCode | undefined {
  const normalizedInput = input.trim().toLowerCase();
  
  // First try exact match with code or name
  const exactMatch = LANGUAGES.find(lang => 
    lang.code.toLowerCase() === normalizedInput ||
    lang.name.toLowerCase() === normalizedInput
  );
  if (exactMatch) return exactMatch.code;

  // Then try partial match with name
  const partialMatch = LANGUAGES.find(lang =>
    lang.name.toLowerCase().includes(normalizedInput) ||
    normalizedInput.includes(lang.name.toLowerCase())
  );
  if (partialMatch) return partialMatch.code;

  return undefined;
}

interface LanguageSectionProps {
  isSource: boolean;
  lang: LanguageCode;
  setLang: (lang: LanguageCode) => void;
  text: string;
  setText: (text: string) => void;
  inputMode: 'dropdown' | 'text';
  setInputMode: (mode: 'dropdown' | 'text') => void;
  langText: string;
  setLangText: (text: string) => void;
  handleCopy: (text: string, setIconState: (state: string) => void) => void;
  handlePaste?: (setIconState: (state: string) => void) => void;
  handleClear: (isSource: boolean) => void;
  copyState: string;
  setCopyState: (state: string) => void;
  pasteState?: string;
  setPasteState?: (state: string) => void;
  detectLanguageFromText: (text: string) => LanguageCode | undefined;
}

export function LanguageSection({
  isSource,
  lang,
  setLang,
  text,
  setText,
  inputMode,
  setInputMode,
  langText,
  setLangText,
  handleCopy,
  handlePaste,
  handleClear,
  copyState,
  setCopyState,
  pasteState,
  setPasteState,
  detectLanguageFromText
}: LanguageSectionProps) {
  const { config } = useAPIConfig();
  const showInputModeSwitch = config.service === 'openai';

  const handleLanguageInput = (input: string) => {
    setLangText(input);
    // Pass through the language text directly as is
    setLang(input as LanguageCode);
  };

  const handleInputModeSwitch = () => {
    const newMode = inputMode === 'dropdown' ? 'text' : 'dropdown';
    setInputMode(newMode);
    if (newMode === 'dropdown') {
      setLangText('');
    } else {
      // When switching to text mode, initialize with current language name
      const currentLang = LANGUAGES.find(l => l.code === lang);
      if (currentLang) {
        setLangText(currentLang.name);
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: isSource ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
      className="bg-[var(--card-bg)] rounded-2xl shadow-lg overflow-hidden border border-[var(--border-color)]"
    >
      <div className="flex items-center justify-between p-3 border-b border-[var(--border-color)]">
        <div className="flex items-center gap-2">
          <div className="w-[180px]">
            {(showInputModeSwitch && inputMode === 'text') ? (
              <input
                type="text"
                value={langText}
                onChange={(e) => handleLanguageInput(e.target.value)}
                onBlur={() => {
                  if (!langText.trim()) {
                    handleInputModeSwitch();
                  }
                }}
                placeholder="Type any language..."
                className="w-full px-3 py-1.5 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--foreground)]/90 placeholder:text-[var(--foreground)]/40 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            ) : (
              <LanguageSelect
                languages={isSource ? LANGUAGES : LANGUAGES.filter(lang => lang.code !== 'auto-detect')}
                value={lang}
                onChange={setLang}
                placeholder="Select language"
              />
            )}
          </div>
          
          {showInputModeSwitch && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleInputModeSwitch}
              className="p-1.5 rounded-lg hover:bg-[var(--hover-bg)] transition-colors"
            >
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4 text-[var(--foreground)]/60"
                animate={{ rotate: inputMode === 'dropdown' ? 0 : 180 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
              </motion.svg>
            </motion.button>
          )}
        </div>
        <div className="flex items-center space-x-1">
          {isSource && handlePaste && setPasteState && pasteState && (
            <IconButton 
              onClick={() => handlePaste(setPasteState)}
              iconState={pasteState}
              type="paste"
            />
          )}
          <IconButton 
            onClick={() => handleCopy(text, setCopyState)}
            iconState={copyState}
            type="copy"
          />
          <IconButton 
            onClick={() => handleClear(isSource)}
            iconState="default"
            type="clear"
          />
        </div>
      </div>
      <div className="relative w-full h-48">
        <textarea
          value={text}
          onChange={isSource ? (e) => setText(e.target.value) : undefined}
          placeholder={isSource ? "Enter text to translate..." : "Translation will appear here..."}
          readOnly={!isSource}
          className="w-full h-full p-4 bg-transparent resize-none focus:outline-none text-lg text-[var(--foreground)]/90 placeholder:text-[var(--foreground)]/40"
        />
      </div>
    </motion.div>
  );
} 