import { useState } from 'react';

export function useClipboard() {
  const [sourceCopyState, setSourceCopyState] = useState('default');
  const [targetCopyState, setTargetCopyState] = useState('default');
  const [sourcePasteState, setSourcePasteState] = useState('default');

  const handleCopy = async (text: string, setIconState: (state: string) => void) => {
    try {
      await navigator.clipboard.writeText(text);
      setIconState('success');
      setTimeout(() => setIconState('default'), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      setIconState('error');
      setTimeout(() => setIconState('default'), 2000);
    }
  };

  const handlePaste = async (setIconState: (state: string) => void) => {
    try {
      const text = await navigator.clipboard.readText();
      setIconState('success');
      setTimeout(() => setIconState('default'), 2000);
      return text;
    } catch (err) {
      console.error('Failed to paste text: ', err);
      setIconState('error');
      setTimeout(() => setIconState('default'), 2000);
      return '';
    }
  };

  return {
    sourceCopyState,
    setSourceCopyState,
    targetCopyState,
    setTargetCopyState,
    sourcePasteState,
    setSourcePasteState,
    handleCopy,
    handlePaste
  };
} 