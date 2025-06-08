import React, { useState, useRef, useEffect, useCallback } from 'react';
import { TranslationMode } from '../types';
import { useClickOutside } from '../hooks/useClickOutside';
import { TuneIcon } from './icons/TuneIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

interface QualityModePopoverProps {
  modes: TranslationMode[];
  selectedModeId: string;
  onChange: (modeId: string) => void;
  disabled?: boolean;
}

export const QualityModePopover: React.FC<QualityModePopoverProps> = ({
  modes,
  selectedModeId,
  onChange,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false); // User's intent
  const [shouldRender, setShouldRender] = useState(false); // DOM presence for animation
  const [animationClass, setAnimationClass] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useClickOutside(wrapperRef, () => {
    if (isOpen) {
      setIsOpen(false); // Trigger close flow
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

  const selectedMode = modes.find(m => m.id === selectedModeId);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };
  
  const handleSelect = (modeId: string) => {
    onChange(modeId);
    setIsOpen(false); // This will trigger the closing animation flow
  };

  return (
    <div ref={wrapperRef} className="relative">
      <button
        onClick={handleToggle}
        disabled={disabled}
        className="flex items-center p-2 rounded-full text-lightSubtleText dark:text-darkSubtleText hover:bg-lightInputBg dark:hover:bg-darkInputBg hover:text-lightText dark:hover:text-darkText disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-250 focus:outline-none focus-visible:ring-2 focus-visible:ring-light dark:focus-visible:ring-dark focus-visible:ring-offset-2 focus-visible:ring-offset-lightCard dark:focus-visible:ring-offset-darkCard active:scale-98"
        aria-label={`Translation quality: ${selectedMode?.name}. Change quality setting.`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <TuneIcon className="w-5 h-5 sm:w-5 sm:h-5" />
        <ChevronDownIcon className={`w-3 h-3 ml-1 text-xs transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {shouldRender && (
        <div
          ref={popoverRef}
          className={`absolute right-0 mt-2 w-64 bg-lightCard dark:bg-darkCard border border-lightBorder dark:border-darkBorder rounded-xl shadow-card py-1.5 z-30 ${animationClass}`}
          role="listbox"
          aria-label="Translation quality options"
          onAnimationEnd={handleAnimationEnd}
        >
          {modes.map(mode => (
            <div
              key={mode.id}
              onClick={() => handleSelect(mode.id)}
              className={`mx-1.5 px-3 py-2.5 cursor-pointer rounded-lg hover:bg-lightInputBg dark:hover:bg-darkInputBg transition-colors duration-100 ${
                mode.id === selectedModeId ? 'bg-primary/10 text-primary dark:text-primary-light font-semibold' : 'text-lightText dark:text-darkText'
              }`}
              role="option"
              aria-selected={mode.id === selectedModeId}
            >
              <p className="text-sm font-medium">{mode.name}</p>
              <p className="text-xs text-lightSubtleText dark:text-darkSubtleText mt-0.5">{mode.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
