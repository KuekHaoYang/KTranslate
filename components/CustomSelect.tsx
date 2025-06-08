
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
  
  const filteredOptions = useMemo(() => {
    if (!searchTerm && !showSearch) return options;
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

  // Effect to manage dropdown visibility, animation, and initial activeIndex
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setAnimationClass("animate-dropdownOpen");
      
      // Set initial active index based on current value and filtered options.
      // When opening, searchTerm should be "", so filteredOptions are effectively `options`.
      let initialActiveIndex = -1;
      if (filteredOptions.length > 0) {
        const idx = filteredOptions.findIndex(opt => opt.value === value);
        initialActiveIndex = (idx !== -1) ? idx : 0; // Default to first if value not found or not set
      }
      setActiveIndex(initialActiveIndex);
    } else {
      // Start closing animation if dropdown was rendered
      if (shouldRender) {
        setAnimationClass("animate-dropdownClose");
      } else {
        // If not rendered, ensure state is reset (e.g., search term)
        setSearchTerm("");
        setActiveIndex(-1);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, value, options]); // `options` is included in case it changes while closed/opening.
                                // `filteredOptions` updates if `options` or `searchTerm` changes.

  // Effect to focus search input *after* the dropdown is rendered and open
  useEffect(() => {
    if (isOpen && shouldRender && showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, shouldRender, showSearch]);


  const handleAnimationEnd = () => {
    if (animationClass === "animate-dropdownClose") {
      setShouldRender(false);
      setSearchTerm(""); // Clear search term when dropdown is fully closed
      setActiveIndex(-1); // Reset active index
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


  // Effect to manage activeIndex bounds and reset if filteredOptions become empty
  useEffect(() => {
    if (shouldRender) {
      if (filteredOptions.length === 0) {
        if (activeIndex !== -1) setActiveIndex(-1);
      } else if (activeIndex >= filteredOptions.length) {
        setActiveIndex(filteredOptions.length - 1);
      } else if (activeIndex < 0 && filteredOptions.length > 0) {
        // If activeIndex is -1 but there are options (e.g. after search clears), set to 0.
        // This is mainly for keyboard navigation to have a starting point.
        // setActiveIndex(0); // Consider if this is always desired. The search input's onChange handles initial activeIndex on search.
      }
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
      case " ": // Treat space like Enter for selection if not in search input
        if (e.key === " " && document.activeElement === searchInputRef.current) {
          return; // Allow space in search input
        }
        e.preventDefault();
        if (isOpen && shouldRender) {
          if (activeIndex >= 0 && activeIndex < filteredOptions.length) {
            handleSelect(filteredOptions[activeIndex].value);
          }
        } else {
          setIsOpen(true);
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
          // Update activeIndex based on typeahead
          const newActiveIndex = options.findIndex(opt => opt.label.toLowerCase().startsWith(newSearchTerm.toLowerCase()));
          setActiveIndex(newActiveIndex !== -1 ? newActiveIndex : (filteredOptions.length > 0 ? 0 : -1) );
        }
        break;
    }
  };
  
  // Effect for typeahead: clear search term after a delay if not using dedicated search input
  useEffect(() => {
    let timer: number; 
    if (isOpen && !showSearch && searchTerm) {
      timer = window.setTimeout(() => setSearchTerm(""), 800);
    }
    return () => window.clearTimeout(timer);
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
      {label && (
        <label id={id ? `${id}-label` : undefined} htmlFor={id || undefined} className="block text-xs font-medium text-lightSubtleText dark:text-darkSubtleText mb-1.5 transition-colors duration-250">
          {label}
        </label>
      )}
      <button
        ref={buttonRef}
        type="button"
        id={id} 
        onClick={handleToggle}
        disabled={disabled}
        className="relative appearance-none w-full bg-lightInputBg dark:bg-darkInputBg border border-lightBorder dark:border-darkBorder text-lightText dark:text-darkText py-2.5 pl-3.5 pr-10 rounded-xl shadow-subtle focus:outline-none focus-visible:border-2 focus-visible:border-primary dark:focus-visible:border-primary-light transition-all duration-250 disabled:opacity-60 disabled:cursor-not-allowed text-sm flex items-center text-left active:scale-98"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={getAriaLabelledBy()}
        aria-label={ariaLabel || (!label && !mainId ? placeholder : undefined)} 
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
                    // When user types in search, set activeIndex to 0 if there are results.
                    // The useEffect for activeIndex bounds will correct to -1 if search yields no results.
                    setActiveIndex(0); 
                }}
                placeholder="Search..."
                className="w-full py-2 px-3 pr-9 bg-lightBg dark:bg-darkBg border border-lightBorder dark:border-darkBorder rounded-lg text-sm text-lightText dark:text-darkText focus:outline-none focus:border-primary dark:focus:border-primary-light transition-colors duration-250"
                onClick={(e) => e.stopPropagation()} // Prevent closing dropdown when clicking search input
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
                        // Reset activeIndex based on current value when search is cleared
                        const idx = options.findIndex(opt => opt.value === value);
                        setActiveIndex(idx !== -1 ? idx : (options.length > 0 ? 0 : -1));
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
                  // aria-disabled={disabled} // Individual options are not disabled; whole select is.
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
