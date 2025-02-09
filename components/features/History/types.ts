export interface Translation {
  id: string;
  sourceText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  timestamp: number;
  isFavorite: boolean;
}

export interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
} 