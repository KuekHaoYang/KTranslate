'use client';

import Dropdown from '@/components/ui/Dropdown';

interface Language {
  code: string;
  name: string;
}

interface LanguageSelectProps {
  value: string;
  onChange: (value: string) => void;
  languages: Language[];
  placeholder?: string;
}

export default function LanguageSelect({ value, onChange, languages, placeholder }: LanguageSelectProps) {
  const options = languages.map(lang => ({
    value: lang.code,
    label: lang.name
  }));

  return (
    <Dropdown
      value={value}
      onChange={onChange}
      options={options}
      placeholder={placeholder}
    />
  );
} 