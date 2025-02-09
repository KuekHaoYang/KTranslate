import { useState, useEffect } from 'react';
import { Language } from '@/lib/constants/languages';

interface LanguagePreferences {
  sourceLang: string;
  targetLang: string;
}

const DEFAULT_PREFERENCES: LanguagePreferences = {
  sourceLang: 'auto-detect',
  targetLang: 'EN'
};

export function useLanguagePreferences() {
  const [preferences, setPreferences] = useState<LanguagePreferences>(DEFAULT_PREFERENCES);

  useEffect(() => {
    // Load saved preferences from localStorage on mount
    const savedPreferences = localStorage.getItem('languagePreferences');
    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences);
        setPreferences(parsed);
      } catch (error) {
        console.error('Failed to parse saved language preferences:', error);
        setPreferences(DEFAULT_PREFERENCES);
      }
    }
  }, []);

  const updateSourceLang = (lang: string) => {
    const newPreferences = { ...preferences, sourceLang: lang };
    setPreferences(newPreferences);
    localStorage.setItem('languagePreferences', JSON.stringify(newPreferences));
  };

  const updateTargetLang = (lang: string) => {
    const newPreferences = { ...preferences, targetLang: lang };
    setPreferences(newPreferences);
    localStorage.setItem('languagePreferences', JSON.stringify(newPreferences));
  };

  const swapLanguages = () => {
    // Don't swap if source is auto-detect
    if (preferences.sourceLang === 'auto-detect') {
      return false;
    }
    
    const newPreferences = {
      sourceLang: preferences.targetLang,
      targetLang: preferences.sourceLang
    };
    setPreferences(newPreferences);
    localStorage.setItem('languagePreferences', JSON.stringify(newPreferences));
    return true;
  };

  return {
    sourceLang: preferences.sourceLang,
    targetLang: preferences.targetLang,
    updateSourceLang,
    updateTargetLang,
    swapLanguages
  };
} 