
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useClickOutside } from '../hooks/useClickOutside';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { ClearIcon } from './icons/ClearIcon';

export interface CustomSelectOption {
  value: string;
  label: string;
  description?: string;
}

interface CustomSelectProps {
  options: CustomSelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
  label?: string; // This can be an internal label text or null if externally labelled
  mainId?: string; // ID for aria-labelledby if label is external
  disabled?: boolean;
  showSearch?: boolean;
  className?: string;
  ariaLabel?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  id,
  label,
  mainId, // Use this for aria-labelledby if label is external
  disabled = false,
  showSearch = false,
  className = "",
  ariaLabel,
}) => {
  const [isOpen, setIsOpen] = useState(false); // User's intent to open/close
  const [shouldRender, setShouldRender] = useState(false); // Controls DOM presence for animation
  const [animationClass, setAnimationClass] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const optionsListRef = useRef<HTMLUListElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);


  const closeDropdown = useCallback(() => {
    if (shouldRender) {
      setAnimationClass("animate-dropdownClose");
      // onAnimationEnd will handle setting shouldRender to false
    } else {
       setIsOpen(false); // ensure intent is synced if already hidden
    }
  }, [shouldRender]);

  useClickOutside(wrapperRef, () => {
    if (isOpen) {
      setIsOpen(false); // Trigger close flow
    }
  });
  
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setAnimationClass("animate-dropdownOpen");
      if (showSearch && searchInputRef.current) {
        searchInputRef.current.focus();
      }
      const selectedIndex = filteredOptions.findIndex(opt => opt.value === value);
      setActiveIndex(selectedIndex === -1 ? 0 : selectedIndex);
    } else {
      // If isOpen becomes false, start closing animation
      if (shouldRender) { // Only if it was actually rendered
        setAnimationClass("animate-dropdownClose");
      } else { // If it wasn't rendered, ensure search term is cleared
        setSearchTerm("");
        setActiveIndex(-1);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, showSearch, value]); // Dependencies kept minimal for this effect


  const handleAnimationEnd = () => {
    if (animationClass === "animate-dropdownClose") {
      setShouldRender(false);
      setSearchTerm("");
      setActiveIndex(-1);
    }
  };

  const scrollToActiveOption = useCallback(() => {
    if (activeIndex !== -1 && optionsListRef.current && shouldRender) {
      const activeItem = optionsListRef.current.children[activeIndex] as HTMLLIElement;
      if (activeItem) {
        activeItem.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [activeIndex, shouldRender]);

  useEffect(() => {
    if (shouldRender) {
      scrollToActiveOption();
    }
  }, [activeIndex, shouldRender, scrollToActiveOption]);

  const filteredOptions = useMemo(() => {
    if (!searchTerm && !showSearch) return options; // Keep this logic for typeahead
    if (!showSearch && searchTerm) { // Typeahead logic for non-search selects
        return options.filter(option => 
            option.label.toLowerCase().startsWith(searchTerm.toLowerCase())
        );
    }
    const term = searchTerm.toLowerCase();
    return options.filter(option =>
      option.label.toLowerCase().includes(term)
    );
  }, [options, searchTerm, showSearch]);

  useEffect(() => {
    if (shouldRender && activeIndex >= filteredOptions.length) {
      setActiveIndex(Math.max(0, filteredOptions.length - 1));
    }
  }, [filteredOptions, activeIndex, shouldRender]);

  const selectedOption = useMemo(() => options.find(option => option.value === value), [options, value]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false); // This will trigger the closing animation flow
    buttonRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;

    switch (e.key) {
      case "Enter":
        e.preventDefault();
        if (isOpen && shouldRender) {
          if (activeIndex >= 0 && activeIndex < filteredOptions.length) {
            handleSelect(filteredOptions[activeIndex].value);
          }
        } else {
          setIsOpen(true);
        }
        break;
      case " ":
        if (document.activeElement !== searchInputRef.current) {
          e.preventDefault();
          if (isOpen && shouldRender) {
            if (activeIndex >= 0 && activeIndex < filteredOptions.length) {
              handleSelect(filteredOptions[activeIndex].value);
            }
          } else {
            setIsOpen(true);
          }
        }
        break;
      case "Escape":
        if (isOpen) {
          setIsOpen(false); // Trigger close flow
          buttonRef.current?.focus();
        }
        break;
      case "ArrowDown":
        e.preventDefault();
        if (!isOpen) setIsOpen(true);
        else setActiveIndex(prev => Math.min(prev + 1, filteredOptions.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        if (!isOpen) setIsOpen(true);
        else setActiveIndex(prev => Math.max(prev - 1, 0));
        break;
      case "Tab":
        if (isOpen) setIsOpen(false); // Trigger close flow
        break;
      default:
        if (isOpen && !showSearch && document.activeElement !== searchInputRef.current && e.key.length === 1 && e.key.match(/[a-zA-Z0-9]/i)) {
          const newSearchTerm = searchTerm + e.key;
          setSearchTerm(newSearchTerm);
          const newActiveIndex = options.findIndex(opt => opt.label.toLowerCase().startsWith(newSearchTerm.toLowerCase()));
          setActiveIndex(newActiveIndex !== -1 ? newActiveIndex : (filteredOptions.length > 0 ? 0 : -1) );
        }
        break;
    }
  };
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen && !showSearch && searchTerm) {
      timer = setTimeout(() => setSearchTerm(""), 800);
    }
    return () => clearTimeout(timer);
  }, [searchTerm, isOpen, showSearch]);

  const getAriaLabelledBy = () => {
    if (label && id) return `${id}-label`; // Internal label
    if (!label && mainId) return mainId; // External label
    return undefined;
  };

  return (
    <div
        ref={wrapperRef}
        className={`relative ${className} w-full`}
        onKeyDown={handleKeyDown}
    >
      {label && ( // Only render label if provided as a prop (internal label scenario)
        <label id={id ? `${id}-label` : undefined} htmlFor={id || undefined} className="block text-xs font-medium text-lightSubtleText dark:text-darkSubtleText mb-1.5 transition-colors duration-250">
          {label}
        </label>
      )}
      <button
        ref={buttonRef}
        type="button"
        id={id} // This id is used by external label's htmlFor if mainId is not set, or is the button's own ID.
        onClick={handleToggle}
        disabled={disabled}
        className="relative appearance-none w-full bg-lightInputBg dark:bg-darkInputBg border border-lightBorder dark:border-darkBorder text-lightText dark:text-darkText py-2.5 pl-3.5 pr-10 rounded-xl shadow-subtle focus:outline-none focus-visible:border-2 focus-visible:border-primary dark:focus-visible:border-primary-light transition-all duration-250 disabled:opacity-60 disabled:cursor-not-allowed text-sm flex items-center text-left active:scale-98"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={getAriaLabelledBy()}
        aria-label={ariaLabel || (!label && !mainId ? placeholder : undefined)} // Provide aria-label if no other label association
        aria-controls={shouldRender ? `${id}-listbox` : undefined}
        aria-activedescendant={shouldRender && activeIndex >=0 && filteredOptions[activeIndex] ? `${id}-option-${filteredOptions[activeIndex].value}` : undefined}
        tabIndex={disabled ? -1 : 0}
      >
        <span className={`truncate ${selectedOption ? 'text-lightText dark:text-darkText' : 'text-lightSubtleText dark:text-darkSubtleText'}`}>
            {selectedOption?.label || placeholder}
        </span>
        <ChevronDownIcon 
          className={`absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-lightSubtleText dark:text-darkSubtleText transition-transform duration-200 pointer-events-none ${isOpen ? 'transform rotate-180' : ''}`} 
        />
      </button>

      {shouldRender && (
        <div
            ref={dropdownRef}
            className={`absolute z-50 w-full mt-1 bg-lightCard dark:bg-darkCard border border-lightBorder dark:border-darkBorder rounded-xl shadow-card max-h-60 flex flex-col overflow-hidden ${animationClass}`}
            role="listbox"
            id={`${id}-listbox`}
            aria-labelledby={getAriaLabelledBy()}
            tabIndex={-1}
            onAnimationEnd={handleAnimationEnd}
        >
          {showSearch && (
            <div className="p-2 border-b border-lightBorder dark:border-darkBorder relative">
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setActiveIndex(e.target.value ? 0 : (options.findIndex(opt => opt.value === value) ?? 0));
                }}
                placeholder="Search..."
                className="w-full py-2 px-3 pr-9 bg-lightBg dark:bg-darkBg border border-lightBorder dark:border-darkBorder rounded-lg text-sm text-lightText dark:text-darkText focus:outline-none focus:border-primary dark:focus:border-primary-light transition-colors duration-250"
                onClick={(e) => e.stopPropagation()}
                aria-label="Search options"
                aria-autocomplete="list"
                aria-controls={`${id}-listbox`}
              />
              {searchTerm && (
                 <button
                    type="button"
                    onClick={() => {
                        setSearchTerm("");
                        searchInputRef.current?.focus();
                        setActiveIndex(options.findIndex(opt => opt.value === value) ?? 0);
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-lightSubtleText dark:text-darkSubtleText hover:text-lightText dark:hover:text-darkText rounded-full focus:outline-none focus:bg-black/5 dark:focus:bg-white/5"
                    aria-label="Clear search"
                  >
                    <ClearIcon className="w-4 h-4" />
                  </button>
              )}
            </div>
          )}
          <ul ref={optionsListRef} className="py-1 overflow-y-auto flex-grow" id={`${id}-options-container`}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <li
                  key={option.value}
                  id={`${id}-option-${option.value}`}
                  role="option"
                  aria-selected={option.value === value}
                  aria-disabled={disabled}
                  className={`mx-1 px-2.5 py-2 text-sm cursor-pointer rounded-lg transition-colors duration-100 
                    ${ option.value === value 
                        ? 'bg-primary/15 text-primary dark:bg-primary-dark/25 dark:text-primary-light font-medium'
                        : (index === activeIndex 
                            ? 'bg-lightInputBg dark:bg-darkInputBg text-lightText dark:text-darkText' 
                            : 'text-lightText dark:text-darkText hover:bg-lightInputBg dark:hover:bg-darkInputBg'
                          )
                    }
                  `}
                  onClick={() => handleSelect(option.value)}
                  onMouseEnter={() => setActiveIndex(index)}
                  title={option.description}
                >
                  {option.label}
                  {option.description && <span className="block text-xs text-lightSubtleText dark:text-darkSubtleText mt-0.5">{option.description}</span>}
                </li>
              ))
            ) : (
              <li className="px-3.5 py-2.5 text-sm text-lightSubtleText dark:text-darkSubtleText text-center">
                No options found.
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
