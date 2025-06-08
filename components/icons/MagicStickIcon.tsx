
import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {}

export const MagicStickIcon: React.FC<IconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M14.5 2.5 L21.5 9.5" />
    <path d="M6 14 L3.5 20.5 L10 18 L12.5 11.5" />
    <path d="M12.5 11.5 C12.5 11.5 16 8 18 6 C20 4 20.5 3.5 21.5 2.5 C22.5 1.5 22.5 1.5 21.5 2.5" />
    <path d="M3 21 L10 14" />
    {/* Sparkles */}
    <path d="M19 2 L20 3" />
    <path d="M13 8 L14 9" />
    <path d="M21 7 L22 8" />
  </svg>
);
