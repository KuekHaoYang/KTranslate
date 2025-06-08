
import React, { useEffect, useRef } from 'react';
import { TranslationHistoryItem } from '../types';
import { HistoryItemCard } from './HistoryItemCard';
import { XMarkIcon } from './icons/XMarkIcon';
import { useClickOutside } from '../hooks/useClickOutside';

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  historyItems: TranslationHistoryItem[];
  onLoadItem: (item: TranslationHistoryItem) => void;
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  isOpen,
  onClose,
  historyItems,
  onLoadItem,
  onDeleteItem,
  onClearAll,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  // useClickOutside is not used here for closing the panel when clicking overlay,
  // because the overlay itself has an onClick={onClose}.
  // It would be used if the panel could be closed by clicking anywhere outside of it,
  // excluding the trigger button. Given the overlay, direct click on overlay is fine.

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      panelRef.current?.focus(); // Focus the panel for accessibility
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = ''; 
    };
  }, [isOpen]);


  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 dark:bg-black/60 z-40 transition-opacity duration-300 ease-in-out
                    ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-lightBg dark:bg-darkBg shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col rounded-l-2xl
                    ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="history-panel-title"
        tabIndex={-1} // Make panel focusable
      >
        <header className="flex items-center justify-between p-5 border-b border-lightBorder dark:border-darkBorder sticky top-0 bg-lightBg dark:bg-darkBg z-10 rounded-tl-2xl">
          <h2 id="history-panel-title" className="text-lg font-semibold text-lightText dark:text-darkText">
            Translation History
          </h2>
          <div className="flex items-center gap-2">
            {historyItems.length > 0 && (
                 <button
                    onClick={onClearAll}
                    className="px-3 py-1.5 text-xs font-semibold text-red-600 dark:text-red-500 hover:bg-red-500/10 active:bg-red-500/15 rounded-lg transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-lightBg dark:focus-visible:ring-offset-darkBg focus-visible:ring-red-500 active:scale-95"
                  >
                    Clear All
                  </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full text-lightSubtleText dark:text-darkSubtleText hover:bg-lightInputBg dark:hover:bg-darkInputBg hover:text-lightText dark:hover:text-darkText active:scale-95 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-lightBg dark:focus-visible:ring-offset-darkBg focus-visible:ring-primary dark:focus-visible:ring-primary-light"
              aria-label="Close history panel"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className={`flex-grow overflow-y-auto p-4 ${historyItems.length === 0 ? 'flex flex-col' : ''}`}>
          {historyItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-grow text-center px-6 py-8">
              <svg 
                className="w-16 h-16 text-lightBorder dark:text-darkBorder mb-4" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth="1"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2zm0 0L2.5 4.5M21 7l.5-2.5" />
                 <path strokeLinecap="round" strokeLinejoin="round" d="M10 12h4m-2-2v4" />

              </svg>
              <p className="text-base font-medium text-lightSubtleText dark:text-darkSubtleText">
                No translation history yet
              </p>
              <p className="text-xs text-lightSubtleText/80 dark:text-darkSubtleText/80 mt-1.5">
                Your translated texts will appear here once you've made some.
              </p>
            </div>
          ) : (
            <div>
              {historyItems.map(item => (
                <HistoryItemCard
                  key={item.id}
                  item={item}
                  onLoad={onLoadItem}
                  onDelete={onDeleteItem}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
