
import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../types';
import { CustomSelect, CustomSelectOption } from './CustomSelect';
import { PencilIcon } from './icons/PencilIcon';
import { CheckIcon } from './icons/CheckIcon';
import { XMarkIcon } from './icons/XMarkIcon';
import { AUTO_DETECT_LANG_CODE } from '../constants';

interface LanguageSelectorProps {
  languages: Language[];
  selectedLanguage: string;
  onChange: (langCodeOrName: string) => void;
  mainId?: string; 
  label?: string | null; 
  disabled?: boolean;
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  languages,
  selectedLanguage,
  onChange,
  mainId, 
  label,  
  disabled = false,
  className = "",
}) => {
  const [isCustomInputMode, setIsCustomInputMode] = useState(false);
  const [customInputValue, setCustomInputValue] = useState("");
  
  const prevSelectedLanguageRef = useRef<string>(selectedLanguage);

  const options: CustomSelectOption[] = languages.map(lang => ({
    value: lang.code,
    label: lang.name,
  }));

  const getLanguageName = (codeOrName: string) => {
    const lang = languages.find(l => l.code === codeOrName || l.name === codeOrName); 
    return lang ? lang.name : codeOrName;
  };
  
  useEffect(() => {
    if (prevSelectedLanguageRef.current !== selectedLanguage) {
      const isKnownCode = languages.some(lang => lang.code === selectedLanguage);
      
      if (selectedLanguage === AUTO_DETECT_LANG_CODE) {
        setIsCustomInputMode(false); 
      } else if (!isKnownCode && selectedLanguage) {
        setIsCustomInputMode(true);
        setCustomInputValue(selectedLanguage);
      } else {
        if (isCustomInputMode) {
          setIsCustomInputMode(false);
        }
      }
      prevSelectedLanguageRef.current = selectedLanguage;
    }
  }, [selectedLanguage, languages, isCustomInputMode]);


  const handleToggleCustomInput = () => {
    if (disabled || selectedLanguage === AUTO_DETECT_LANG_CODE) return; 
    
    if (!isCustomInputMode) {
      setCustomInputValue(getLanguageName(selectedLanguage));
    }
    setIsCustomInputMode(!isCustomInputMode);
  };

  const handleSaveCustomInput = () => {
    if (customInputValue.trim()) {
      onChange(customInputValue.trim());
      prevSelectedLanguageRef.current = customInputValue.trim(); 
    }
    setIsCustomInputMode(false);
  };

  const handleCancelCustomInput = () => {
    setIsCustomInputMode(false);
    setCustomInputValue(getLanguageName(selectedLanguage)); 
  };

  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomInputValue(e.target.value);
  };
  
  const isAutoDetectSelected = selectedLanguage === AUTO_DETECT_LANG_CODE;
  
  // Dynamic width for the button container
  // For Save/Cancel (isCustomInputMode = true): 78px = 4.875rem
  // For Pencil (isCustomInputMode = false): 38px = 2.375rem (18px icon + 2 * 10px padding for p-2.5 button)
  const buttonContainerDynamicWidthClass = isCustomInputMode ? "w-[4.875rem]" : "w-[2.375rem]";

  return (
    <div className={`flex items-center ${className} ${!isAutoDetectSelected ? 'gap-2' : ''}`}>
      <div className={`flex-grow relative`}>
        <div
          className={`transition-all duration-300 ease-in-out w-full 
                     ${isCustomInputMode 
                       ? 'opacity-0 transform -translate-y-2 scale-95 pointer-events-none absolute' 
                       : 'opacity-100 transform translate-y-0 scale-100'}`}
          aria-hidden={isCustomInputMode}
        >
          <CustomSelect
            id={mainId}
            mainId={mainId}
            label={typeof label === 'string' ? label : undefined}
            options={options}
            value={options.find(opt => opt.value === selectedLanguage) ? selectedLanguage : ""}
            onChange={(val) => {
              onChange(val);
              prevSelectedLanguageRef.current = val; 
              if (isCustomInputMode && val !== AUTO_DETECT_LANG_CODE) setIsCustomInputMode(false);
              if (val === AUTO_DETECT_LANG_CODE) setIsCustomInputMode(false); 
            }}
            disabled={disabled}
            showSearch={true}
            placeholder={getLanguageName(selectedLanguage) || "Select or type language"}
            className="w-full"
          />
        </div>

        <div
          className={`transition-all duration-300 ease-in-out w-full 
                     ${isCustomInputMode 
                       ? 'opacity-100 transform translate-y-0 scale-100' 
                       : 'opacity-0 transform -translate-y-2 scale-95 pointer-events-none absolute'}`}
          aria-hidden={!isCustomInputMode}
        >
          <input
            type="text"
            id={`${mainId}-custom-input`}
            value={customInputValue}
            onChange={handleCustomInputChange}
            disabled={disabled}
            placeholder="Enter language name"
            className="w-full bg-lightInputBg dark:bg-darkInputBg border border-lightBorder dark:border-darkBorder text-lightText dark:text-darkText py-2.5 px-3.5 rounded-xl shadow-subtle focus:outline-none focus:border-2 focus:border-primary dark:focus:border-primary-light transition-all duration-250 text-sm h-11"
            aria-labelledby={mainId}
          />
        </div>
      </div>
      
      {!isAutoDetectSelected && (
        <div className={`flex-shrink-0 h-11 flex items-center justify-end ${buttonContainerDynamicWidthClass} transition-all duration-200`}>
          {!isCustomInputMode && ( 
            <button
              onClick={handleToggleCustomInput}
              disabled={disabled}
              className="p-2.5 rounded-xl text-lightSubtleText dark:text-darkSubtleText hover:bg-lightInputBg dark:hover:bg-darkInputBg hover:text-lightText dark:hover:text-darkText disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-light dark:focus-visible:ring-dark active:scale-95 animate-fadeIn"
              aria-label="Enter custom language"
            >
              <PencilIcon className="w-4.5 h-4.5" />
            </button>
          )}
          {isCustomInputMode && ( 
            <div className="flex items-center gap-1.5 animate-fadeIn">
              <button
                onClick={handleSaveCustomInput}
                disabled={disabled || !customInputValue.trim()}
                className="p-2 rounded-lg text-green-600 dark:text-green-500 hover:bg-green-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 active:scale-95"
                aria-label="Save custom language"
              >
                <CheckIcon className="w-5 h-5" />
              </button>
              <button
                onClick={handleCancelCustomInput}
                disabled={disabled}
                className="p-2 rounded-lg text-red-600 dark:text-red-500 hover:bg-red-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 active:scale-95"
                aria-label="Cancel custom language input"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
