import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HistoryPanelProps } from './types';
import { useTranslationHistory } from './hooks/useTranslationHistory';
import SearchBar from './components/SearchBar';
import FilterBar from './components/FilterBar';
import TranslationItem from './components/TranslationItem';
import ClearConfirmDialog from './components/ClearConfirmDialog';

export default function HistoryPanel({ isOpen, onClose }: HistoryPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  
  const { translations, handleToggleFavorite, handleDelete, clearAll } = useTranslationHistory(isOpen);

  // Control body overflow when panel is open (mobile only)
  useEffect(() => {
    const handleOverflow = () => {
      const isMobile = window.innerWidth < 768; // md breakpoint in Tailwind
      if (isOpen && isMobile) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
      }
    };

    handleOverflow();
    window.addEventListener('resize', handleOverflow);

    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('resize', handleOverflow);
    };
  }, [isOpen]);

  const filteredTranslations = translations
    .filter(t => showFavoritesOnly ? t.isFavorite : true)
    .filter(t => 
      searchQuery ? 
        t.sourceText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.translatedText.toLowerCase().includes(searchQuery.toLowerCase())
      : true
    )
    .sort((a, b) => b.timestamp - a.timestamp);

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 pointer-events-none"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed md:absolute inset-0 md:inset-auto md:right-4 md:top-4 md:bottom-4 md:w-[380px] bg-[var(--panel-bg)] backdrop-blur-2xl md:rounded-3xl border border-[var(--border-color)] overflow-hidden shadow-2xl pointer-events-auto"
          >
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="px-5 py-4 flex items-center justify-between">
                <h2 className="text-base font-medium flex items-center gap-2 text-[var(--text-primary)]">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-[var(--text-secondary)]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  Translation History
                </h2>
                <button
                  onClick={onClose}
                  className="p-1.5 hover:bg-[var(--hover-bg)] rounded-lg transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Search and filters */}
              <div className="px-5 py-3 space-y-4">
                <SearchBar value={searchQuery} onChange={setSearchQuery} />
                <FilterBar 
                  showFavoritesOnly={showFavoritesOnly}
                  onToggleFavorites={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  onClearAll={() => setShowClearConfirm(true)}
                />
              </div>

              {/* Translation list */}
              <div className="flex-1 overflow-y-auto mt-2 px-5">
                {filteredTranslations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-[var(--text-secondary)]">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mb-2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                    <p className="text-sm">No translations found</p>
                  </div>
                ) : (
                  <div className="space-y-3 pb-4">
                    {filteredTranslations.map((translation) => (
                      <TranslationItem
                        key={translation.id}
                        translation={translation}
                        onToggleFavorite={handleToggleFavorite}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <AnimatePresence>
              <ClearConfirmDialog
                isOpen={showClearConfirm}
                onCancel={() => setShowClearConfirm(false)}
                onConfirm={() => {
                  clearAll();
                  setShowClearConfirm(false);
                }}
              />
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
} 