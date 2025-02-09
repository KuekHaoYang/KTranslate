'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface HistoryPanelContextType {
  isHistoryOpen: boolean;
  setIsHistoryOpen: (open: boolean) => void;
}

const HistoryPanelContext = createContext<HistoryPanelContextType | undefined>(undefined);

export function HistoryPanelProvider({ children }: { children: ReactNode }) {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  return (
    <HistoryPanelContext.Provider value={{ isHistoryOpen, setIsHistoryOpen }}>
      {children}
    </HistoryPanelContext.Provider>
  );
}

export function useHistoryPanel() {
  const context = useContext(HistoryPanelContext);
  if (context === undefined) {
    throw new Error('useHistoryPanel must be used within a HistoryPanelProvider');
  }
  return context;
} 