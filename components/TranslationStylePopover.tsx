
import React, { useState, useRef, useEffect } from 'react';
import { TranslationStyle } from '../types';
import { useClickOutside } from '../hooks/useClickOutside';
import { MagicStickIcon } from './icons/MagicStickIcon'; // Assuming a new icon for style
import { ChevronDownIcon } from './icons/ChevronDownIcon';

interface TranslationStylePopoverProps {
  styles: TranslationStyle[];
  selectedStyleId: string;
  onChange: (styleId: string) => void;
  disabled?: boolean;
}

export const TranslationStylePopover: React.FC<TranslationStylePopoverProps> = ({
  styles,
  selectedStyleId,
  onChange,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [animationClass, setAnimationClass] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  useClickOutside(wrapperRef, () => {
    if (isOpen) {
      setIsOpen(false);
    }
  });

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setAnimationClass("animate-popoverOpen");
    } else {
      if (shouldRender) {
        setAnimationClass("animate-popoverClose");
      }
    }
  }, [isOpen, shouldRender]);

  const handleAnimationEnd = () => {
    if (animationClass === "animate-popoverClose") {
      setShouldRender(false);
    }
  };

  const selectedStyle = styles.find(s => s.id === selectedStyleId);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };
  
  const handleSelect = (styleId: string) => {
    onChange(styleId);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <button
        onClick={handleToggle}
        disabled={disabled}
        className="flex items-center p-2 rounded-full text-lightSubtleText dark:text-darkSubtleText hover:bg-lightInputBg dark:hover:bg-darkInputBg hover:text-lightText dark:hover:text-darkText disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-250 focus:outline-none focus-visible:ring-2 focus-visible:ring-light dark:focus-visible:ring-dark focus-visible:ring-offset-2 focus-visible:ring-offset-lightCard dark:focus-visible:ring-offset-darkCard active:scale-98"
        aria-label={`Translation style: ${selectedStyle?.name}. Change style setting.`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <MagicStickIcon className="w-5 h-5 sm:w-5 sm:h-5" />
        <ChevronDownIcon className={`w-3 h-3 ml-1 text-xs transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {shouldRender && (
        <div
          className={`absolute right-0 mt-2 w-72 bg-lightCard dark:bg-darkCard border border-lightBorder dark:border-darkBorder rounded-xl shadow-card py-1.5 z-30 ${animationClass}`}
          role="listbox"
          aria-label="Translation style options"
          onAnimationEnd={handleAnimationEnd}
        >
          {styles.map(style => (
            <div
              key={style.id}
              onClick={() => handleSelect(style.id)}
              className={`mx-1.5 px-3 py-2.5 cursor-pointer rounded-lg hover:bg-lightInputBg dark:hover:bg-darkInputBg transition-colors duration-100 ${
                style.id === selectedStyleId ? 'bg-primary/10 text-primary dark:text-primary-light font-semibold' : 'text-lightText dark:text-darkText'
              }`}
              role="option"
              aria-selected={style.id === selectedStyleId}
            >
              <p className="text-sm font-medium">{style.name}</p>
              <p className="text-xs text-lightSubtleText dark:text-darkSubtleText mt-0.5">{style.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
