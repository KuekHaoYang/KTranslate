
import React from 'react';
import { TranslationHistoryItem } from '../types';
import { TRANSLATION_MODES, TRANSLATION_STYLES } from '../constants';
import { XMarkIcon } from './icons/XMarkIcon'; // Re-use XMarkIcon for delete

interface HistoryItemCardProps {
  item: TranslationHistoryItem;
  onLoad: (item: TranslationHistoryItem) => void;
  onDelete: (id: string) => void;
}

const truncateText = (text: string, maxLength: number = 60) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const HistoryItemCard: React.FC<HistoryItemCardProps> = ({ item, onLoad, onDelete }) => {
  const modeName = TRANSLATION_MODES.find(m => m.id === item.modeId)?.name || 'Unknown Mode';
  const styleName = TRANSLATION_STYLES.find(s => s.id === item.styleId)?.name || 'Unknown Style';

  const formattedTimestamp = new Date(item.timestamp).toLocaleString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="bg-lightInputBg dark:bg-darkInputBg p-3.5 rounded-xl shadow-subtle mb-3 transition-colors duration-250 hover:shadow-card">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="text-xs font-semibold text-primary dark:text-primary-light">
            {item.sourceLangName} → {item.targetLangName}
          </p>
          <p className="text-xs text-lightSubtleText dark:text-darkSubtleText mt-0.5">
            {formattedTimestamp}
          </p>
        </div>
        <button
          onClick={() => onDelete(item.id)}
          className="p-1 rounded-full text-lightSubtleText dark:text-darkSubtleText hover:bg-red-500/10 hover:text-red-500 dark:hover:text-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 transition-colors duration-150"
          aria-label="Delete history item"
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
      </div>

      <div className="mb-2.5 space-y-1.5">
        <div>
          <p className="text-xs text-lightSubtleText dark:text-darkSubtleText mb-0.5">Input:</p>
          <p className="text-sm text-lightText dark:text-darkText leading-snug">{truncateText(item.inputText)}</p>
        </div>
        <div>
          <p className="text-xs text-lightSubtleText dark:text-darkSubtleText mb-0.5">Translation:</p>
          <p className="text-sm text-lightText dark:text-darkText leading-snug">{truncateText(item.outputText)}</p>
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-2">
         <p className="text-xs text-lightSubtleText dark:text-darkSubtleText">
           {modeName} / {styleName.split(' & ')[0]} {/* Shorten style name */}
         </p>
        <button
          onClick={() => onLoad(item)}
          className="px-3 py-1.5 text-xs font-medium bg-primary/15 hover:bg-primary/25 dark:bg-primary-light/15 dark:hover:bg-primary-light/25 text-primary dark:text-primary-light rounded-lg transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-primary-light"
        >
          Use Translation
        </button>
      </div>
    </div>
  );
};
