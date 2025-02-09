import { motion } from 'framer-motion';

interface ClearConfirmDialogProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ClearConfirmDialog({ isOpen, onCancel, onConfirm }: ClearConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.12] backdrop-blur-xl border border-white/10 p-6 rounded-2xl w-[280px] shadow-xl">
        <h3 className="text-lg font-medium text-white mb-2">Clear History</h3>
        <p className="text-sm text-white/70 mb-6">Are you sure you want to clear all translation history?</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-white/70 hover:bg-white/10 transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors text-sm"
          >
            Clear All
          </button>
        </div>
      </div>
    </motion.div>
  );
} 