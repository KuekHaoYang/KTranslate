'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface DropdownOption {
  value: string;
  label: string;
}

export interface DropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
}

export default function Dropdown({ 
  value, 
  onChange, 
  options, 
  placeholder = 'Select option'
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const container = e.target as HTMLDivElement;
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;
      
      const topOpacity = Math.min(scrollTop / 20, 1);
      const bottomOpacity = Math.min((scrollHeight - clientHeight - scrollTop) / 20, 1);
      
      container.style.setProperty('--scroll-top', topOpacity.toString());
      container.style.setProperty('--scroll-bottom', bottomOpacity.toString());
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      handleScroll({ target: scrollContainer } as unknown as Event);
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, [isOpen]);

  const filteredOptions = options.filter(opt =>
    opt.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    opt.value.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedOption = options.find(opt => opt.value === value);

  const dropdownVariants = {
    hidden: { 
      opacity: 0,
      y: -8,
      scale: 0.98,
      transition: { duration: 0.2, ease: 'easeOut' }
    },
    visible: { 
      opacity: 1,
      y: 4,
      scale: 1,
      transition: { type: "spring", stiffness: 400, damping: 25 }
    },
    exit: { 
      opacity: 0,
      y: -8,
      scale: 0.98,
      transition: { duration: 0.2, ease: 'easeIn' }
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full px-4 py-2.5 text-left rounded-xl
          bg-[var(--card-bg)] hover:bg-[var(--hover-bg)]
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-blue-500/20
          border border-[var(--border-color)]
          shadow-[var(--card-shadow)]
          active:scale-[0.98]
        `}
      >
        <div className="flex items-center justify-between">
          <span className="truncate text-[var(--foreground)]/90 font-medium">
            {selectedOption?.label || placeholder}
          </span>
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-4 h-4 ml-2 text-[var(--foreground)]/60"
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </motion.svg>
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute top-full mt-1 z-50 w-full"
          >
            <div className="bg-[var(--card-bg)] rounded-2xl shadow-lg border border-[var(--border-color)] overflow-hidden"
              style={{ 
                boxShadow: 'var(--card-shadow)'
              }}
            >
              <div className="px-2 py-1.5">
                <div className="relative">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-full h-8 px-3 pl-8 rounded-xl
                      bg-[var(--card-bg)] text-[var(--foreground)]/90 text-sm
                      placeholder:text-[var(--foreground)]/40
                      focus:outline-none
                      border border-[var(--border-color)]
                      transition-colors duration-200"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground)]/40"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </div>
              </div>
              <div 
                ref={scrollContainerRef}
                className="max-h-[140px] overflow-y-auto scrollbar-hide px-2 py-1"
              >
                <div className="space-y-1">
                  {filteredOptions.map((option, index) => (
                    <motion.button
                      key={option.value}
                      onClick={() => {
                        onChange(option.value);
                        setIsOpen(false);
                        setSearchQuery('');
                      }}
                      onHoverStart={() => setHoveredIndex(index)}
                      onHoverEnd={() => setHoveredIndex(null)}
                      className={`
                        w-full px-3 py-1.5 text-left
                        text-[var(--foreground)]/90 text-sm
                        transition-all duration-200
                        flex items-center justify-between
                        rounded-lg
                        ${hoveredIndex === index ? 'bg-[var(--hover-bg)] text-[var(--foreground)] rounded-xl' : 'hover:bg-[var(--hover-bg)]'}
                      `}
                      whileHover={{ x: 2 }}
                      transition={{ type: "spring", stiffness: 800, damping: 15 }}
                    >
                      <span>{option.label}</span>
                      {value === option.value && (
                        <motion.svg
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2.5}
                          stroke="currentColor"
                          className="w-3.5 h-3.5 text-blue-400"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </motion.svg>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 