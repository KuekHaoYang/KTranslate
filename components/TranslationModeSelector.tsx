// THIS COMPONENT IS NO LONGER USED.
// Functionality has been moved to QualityModePopover.tsx in the Header.
// It can be safely deleted or kept for reference if major refactoring is planned.

import React from 'react';
import { TranslationMode } from '../types';
import { CustomSelect, CustomSelectOption } from './CustomSelect';

interface TranslationModeSelectorProps {
  modes: TranslationMode[];
  selectedModeId: string;
  onChange: (modeId: string) => void;
  id?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export const TranslationModeSelector: React.FC<TranslationModeSelectorProps> = ({
  modes,
  selectedModeId,
  onChange,
  id,
  label = "Translation Quality & Speed",
  disabled = false,
  className = "",
}) => {
  const options: CustomSelectOption[] = modes.map(mode => ({
    value: mode.id,
    label: mode.name,
    description: mode.description,
  }));

  return (
    <CustomSelect
      id={id}
      label={label}
      options={options}
      value={selectedModeId}
      onChange={onChange}
      disabled={disabled}
      showSearch={false} // Search not needed for few options
      placeholder="Select mode"
      className={className}
      ariaLabel={label || "Select translation mode"}
    />
  );
};
