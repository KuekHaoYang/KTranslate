import { format } from 'date-fns';
import { Translation } from '../types';

interface TranslationItemProps {
  translation: Translation;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TranslationItem({ translation, onToggleFavorite, onDelete }: TranslationItemProps) {
  return (
    <div className="p-4 rounded-2xl bg-[var(--panel-bg)] hover:bg-[var(--hover-bg)] border border-[var(--border-color)] transition-all group backdrop-blur-md">
      {/* Language indicator and timestamp */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-xs text-[var(--text-secondary)]">
            {translation.sourceLang} → {translation.targetLang}
          </span>
          <span className="text-xs opacity-50 text-[var(--text-secondary)]">
            {format(translation.timestamp, 'MMM d, HH:mm')}
          </span>
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onToggleFavorite(translation.id)}
            className={`p-1.5 rounded-xl transition-colors ${
              translation.isFavorite 
                ? 'text-amber-400' 
                : 'text-[var(--text-secondary)] hover:text-amber-400 hover:bg-[var(--hover-bg)]'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill={translation.isFavorite ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(translation.id)}
            className="p-1.5 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Translation content */}
      <div className="space-y-2">
        <p className="text-sm text-[var(--text-secondary)]">{translation.sourceText}</p>
        <p className="text-sm text-[var(--text-primary)] font-medium">{translation.translatedText}</p>
      </div>
    </div>
  );
} 