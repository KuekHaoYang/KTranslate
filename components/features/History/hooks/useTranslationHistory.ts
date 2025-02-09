import { useState, useEffect } from 'react';
import { Translation } from '../types';

export const useTranslationHistory = (isOpen: boolean) => {
  const [translations, setTranslations] = useState<Translation[]>([]);

  const loadTranslations = () => {
    const savedTranslations = localStorage.getItem('translationHistory');
    if (savedTranslations) {
      try {
        setTranslations(JSON.parse(savedTranslations));
      } catch (error) {
        console.error('Failed to parse translation history:', error);
        setTranslations([]);
      }
    }
  };

  // Load translations initially and set up storage event listener
  useEffect(() => {
    if (isOpen) {
      loadTranslations();
    }

    // Listen for storage changes from other tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'translationHistory' && isOpen) {
        loadTranslations();
      }
    };

    // Listen for custom event for same-tab updates
    const handleTranslationUpdate = () => {
      if (isOpen) {
        loadTranslations();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('translationHistoryUpdate', handleTranslationUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('translationHistoryUpdate', handleTranslationUpdate);
    };
  }, [isOpen]);

  // Save translations to localStorage whenever they change
  useEffect(() => {
    if (translations.length > 0) {
      localStorage.setItem('translationHistory', JSON.stringify(translations));
    }
  }, [translations]);

  const handleToggleFavorite = (id: string) => {
    setTranslations(prev => 
      prev.map(t => 
        t.id === id ? { ...t, isFavorite: !t.isFavorite } : t
      )
    );
  };

  const handleDelete = (id: string) => {
    setTranslations(prev => prev.filter(t => t.id !== id));
  };

  const clearAll = () => {
    setTranslations([]);
    localStorage.removeItem('translationHistory');
  };

  return {
    translations,
    handleToggleFavorite,
    handleDelete,
    clearAll
  };
}; 