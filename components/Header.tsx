
import React from 'react';
import { Theme } from '../types';
import { useTheme } from '../hooks/useTheme';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';
import { QualityModePopover } from './QualityModePopover'; 
import { TranslationStylePopover } from './TranslationStylePopover';
import { HistoryIcon } from './icons/HistoryIcon'; // New import
import { TRANSLATION_MODES, TRANSLATION_STYLES } from '../constants'; 

interface HeaderProps {
  selectedModeId: string;
  onModeChange: (modeId: string) => void;
  selectedStyleId: string;
  onStyleChange: (styleId: string) => void;
  isTranslationLoading: boolean;
  onToggleHistoryPanel: () => void; // New prop
}

export const Header: React.FC<HeaderProps> = ({ 
  selectedModeId, 
  onModeChange, 
  selectedStyleId, 
  onStyleChange, 
  isTranslationLoading,
  onToggleHistoryPanel // Destructure new prop
}) => {
  const [theme, toggleTheme] = useTheme();

  return (
    <header className="py-3 px-4 sm:px-6 bg-lightCard dark:bg-darkCard border-b border-lightBorder dark:border-darkBorder shadow-subtle transition-colors duration-250 sticky top-0 z-40">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl sm:text-2xl font-semibold text-primary dark:text-primary-light tracking-tight">
          K<span className="text-accent dark:text-accent-light font-bold">Translate</span>
        </h1>
        <div className="flex items-center space-x-1 sm:space-x-1.5">
          <TranslationStylePopover
            styles={TRANSLATION_STYLES}
            selectedStyleId={selectedStyleId}
            onChange={onStyleChange}
            disabled={isTranslationLoading}
          />
          <QualityModePopover
            modes={TRANSLATION_MODES}
            selectedModeId={selectedModeId}
            onChange={onModeChange}
            disabled={isTranslationLoading}
          />
          <button
            onClick={onToggleHistoryPanel} // Attach handler
            className="p-2 rounded-full text-lightSubtleText dark:text-darkSubtleText hover:bg-lightInputBg dark:hover:bg-darkInputBg hover:text-lightText dark:hover:text-darkText transition-all duration-250 focus:outline-none focus-visible:ring-2 focus-visible:ring-light dark:focus-visible:ring-dark focus-visible:ring-offset-2 focus-visible:ring-offset-lightCard dark:focus-visible:ring-offset-darkCard active:scale-95"
            aria-label="View translation history"
            disabled={isTranslationLoading} // Optional: disable if loading
          >
            <HistoryIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-lightSubtleText dark:text-darkSubtleText hover:bg-lightInputBg dark:hover:bg-darkInputBg hover:text-lightText dark:hover:text-darkText transition-all duration-250 focus:outline-none focus-visible:ring-2 focus-visible:ring-light dark:focus-visible:ring-dark focus-visible:ring-offset-2 focus-visible:ring-offset-lightCard dark:focus-visible:ring-offset-darkCard active:scale-95"
            aria-label={theme === Theme.Light ? "Switch to dark theme" : "Switch to light theme"}
          >
            {theme === Theme.Light ? (
              <MoonIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            ) : (
              <SunIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
