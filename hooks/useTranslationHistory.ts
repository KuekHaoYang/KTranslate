
import { useState, useEffect, useCallback } from 'react';
import { TranslationHistoryItem } from '../types';
import { MAX_HISTORY_ITEMS } from '../constants';

const HISTORY_STORAGE_KEY = 'ktranslate_history';

export function useTranslationHistory(): [
  TranslationHistoryItem[],
  (itemData: Omit<TranslationHistoryItem, 'id' | 'timestamp'>) => void,
  (id: string) => void,
  () => void
] {
  const [historyItems, setHistoryItems] = useState<TranslationHistoryItem[]>([]);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (storedHistory) {
        const parsedHistory: TranslationHistoryItem[] = JSON.parse(storedHistory);
        // Ensure timestamps are numbers, not strings, if old data exists
        const validatedHistory = parsedHistory.map(item => ({
          ...item,
          timestamp: Number(item.timestamp) 
        }));
        setHistoryItems(validatedHistory);
      }
    } catch (error) {
      console.error("Failed to load translation history from localStorage:", error);
      localStorage.removeItem(HISTORY_STORAGE_KEY); // Clear corrupted data
    }
  }, []);

  const saveHistory = useCallback((items: TranslationHistoryItem[]) => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Failed to save translation history to localStorage:", error);
    }
  }, []);

  const addHistoryItem = useCallback((itemData: Omit<TranslationHistoryItem, 'id' | 'timestamp'>) => {
    setHistoryItems(prevItems => {
      const newItem: TranslationHistoryItem = {
        ...itemData,
        id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
        timestamp: Date.now(),
      };
      // Prevent duplicates based on exact same input, output, and languages (optional, but good for UX)
      const isDuplicate = prevItems.some(
        (prevItem) =>
          prevItem.inputText === newItem.inputText &&
          prevItem.outputText === newItem.outputText &&
          prevItem.sourceLangCode === newItem.sourceLangCode &&
          prevItem.targetLangCode === newItem.targetLangCode &&
          prevItem.modeId === newItem.modeId &&
          prevItem.styleId === newItem.styleId
      );
      if (isDuplicate) return prevItems;


      const updatedItems = [newItem, ...prevItems].slice(0, MAX_HISTORY_ITEMS);
      saveHistory(updatedItems);
      return updatedItems;
    });
  }, [saveHistory]);

  const removeHistoryItem = useCallback((id: string) => {
    setHistoryItems(prevItems => {
      const updatedItems = prevItems.filter(item => item.id !== id);
      saveHistory(updatedItems);
      return updatedItems;
    });
  }, [saveHistory]);

  const clearAllHistory = useCallback(() => {
    const confirmed = window.confirm("Are you sure you want to clear all translation history? This action cannot be undone.");
    if (confirmed) {
        setHistoryItems([]);
        saveHistory([]);
    }
  }, [saveHistory]);

  return [historyItems, addHistoryItem, removeHistoryItem, clearAllHistory];
}
