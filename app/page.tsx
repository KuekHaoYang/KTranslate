'use client';

import Header from '@/components/layout/Header';
import TranslateBox from '@/components/features/TranslateBox/TranslateBox';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { useHistoryPanel } from '@/context/HistoryPanelContext';
import { useEffect, useState } from 'react';

export default function Home() {
  const { theme } = useTheme();
  const { isHistoryOpen } = useHistoryPanel();
  const isDark = theme === 'dark';

  // State to manage class names for gradient blobs
  const [gradientClasses, setGradientClasses] = useState('');

  useEffect(() => {
    // Set gradient classes based on theme
    setGradientClasses(isDark ? 'bg-blue-500/20' : 'bg-blue-500/10');
  }, [isDark]);

  return (
    <div className="min-h-screen bg-[var(--background)] relative overflow-hidden">
      <motion.div 
        className="w-full"
        initial={{ paddingRight: 0 }}
        animate={{
          paddingRight: isHistoryOpen ? '24rem' : '0',
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      >
        {/* Background gradient blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute -top-[40%] -left-[20%] w-[70%] h-[70%] rounded-full ${gradientClasses} blur-[120px] animate-pulse`} />
          <div className={`absolute -bottom-[30%] -right-[20%] w-[70%] h-[70%] rounded-full ${gradientClasses} blur-[120px] animate-pulse`} />
        </div>

        <Header />
        
        <main className="relative pt-24 px-4 pb-12">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                KTranslate
              </h1>
              <p className="text-lg text-[var(--foreground)]/60">
                Fast and accurate translations for everyone
              </p>
            </motion.div>
            
            <TranslateBox />
          </div>
        </main>
      </motion.div>
    </div>
  );
}
