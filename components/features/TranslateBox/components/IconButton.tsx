import { motion, AnimatePresence } from 'framer-motion';

interface IconButtonProps {
  onClick: () => void;
  iconState: string;
  type: 'copy' | 'swap' | 'translate' | 'paste' | 'clear';
}

export function IconButton({ onClick, iconState, type }: IconButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 800, damping: 15 }}
      className={`
        p-2.5 rounded-xl transition-all duration-100
        ${type === 'translate' 
          ? `${iconState === 'loading' 
              ? 'bg-[#E91E63] hover:bg-[#D81B60]' 
              : 'bg-blue-600 hover:bg-blue-500'} 
             text-white px-8 py-3 shadow-lg flex items-center justify-center w-[280px] text-lg font-medium` 
          : 'hover:bg-[var(--hover-bg)]'}
      `}
      onClick={onClick}
      aria-label={type}
    >
      <AnimatePresence mode="wait" initial={false}>
        {type === 'translate' && (
          <motion.span
            key={iconState}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="font-medium text-white"
          >
            {iconState === 'default' && 'Translate'}
            {iconState === 'loading' && 'Stop (Translating...)'}
            {iconState === 'success' && 'Translate'}
          </motion.span>
        )}
        {type === 'copy' && (
          <>
            {iconState === 'default' && (
              <motion.svg
                key={`copy-default-${type}`}
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.3 }}
                transition={{ duration: 0.2 }}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5 text-[var(--foreground)]/60"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
              </motion.svg>
            )}
            {iconState === 'success' && (
              <motion.svg
                key={`copy-success-${type}`}
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.3 }}
                transition={{ duration: 0.2 }}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-5 h-5 text-green-500"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </motion.svg>
            )}
            {iconState === 'error' && (
              <motion.svg
                key={`copy-error-${type}`}
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.3 }}
                transition={{ duration: 0.2 }}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-5 h-5 text-red-500"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </motion.svg>
            )}
          </>
        )}
        {type === 'swap' && (
          <>
            {iconState === 'default' && (
              <motion.svg
                key={`swap-default-${type}`}
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: 1, scale: 1, rotate: 180 }}
                exit={{ opacity: 0, scale: 0.3 }}
                transition={{ duration: 0.2 }}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
              </motion.svg>
            )}
            {iconState === 'success' && (
              <motion.svg
                key={`swap-success-${type}`}
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.3 }}
                transition={{ duration: 0.2 }}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-5 h-5 text-green-500"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </motion.svg>
            )}
          </>
        )}
        {type === 'paste' && (
          <>
            {iconState === 'default' && (
              <motion.svg
                key="paste-default"
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.3 }}
                transition={{ duration: 0.2 }}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5 text-[var(--foreground)]/60"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </motion.svg>
            )}
            {iconState === 'success' && (
              <motion.svg
                key="paste-success"
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.3 }}
                transition={{ duration: 0.2 }}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5 text-green-500"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </motion.svg>
            )}
          </>
        )}
        {type === 'clear' && (
          <motion.svg
            key="clear-default"
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.3 }}
            transition={{ duration: 0.2 }}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5 text-[var(--foreground)]/60"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </motion.svg>
        )}
      </AnimatePresence>
    </motion.button>
  );
} 