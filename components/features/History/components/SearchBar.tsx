interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search translations..."
        className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[var(--hover-bg)] border border-[var(--border-color)] focus:outline-none focus:border-[var(--text-secondary)] transition-colors text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]"
      />
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
  );
} 