interface FilterBarProps {
  showFavoritesOnly: boolean;
  onToggleFavorites: () => void;
  onClearAll: () => void;
}

export default function FilterBar({ showFavoritesOnly, onToggleFavorites, onClearAll }: FilterBarProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onToggleFavorites}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
          showFavoritesOnly 
            ? 'bg-[var(--hover-bg)] text-[var(--text-primary)]' 
            : 'text-[var(--text-secondary)] hover:bg-[var(--hover-bg)]'
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill={showFavoritesOnly ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
        Favorites
      </button>

      <button
        onClick={onClearAll}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)] transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>
        Clear All
      </button>
    </div>
  );
} 