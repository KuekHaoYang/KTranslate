import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {}

export const TranslateIcon: React.FC<IconProps> = (props) => (
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
    <path d="M20.5 10H3.5" />
    <path d="M3.5 14H20.5" />
    <path d="M12 4L8 8L12 12" />
    <path d="M12 12L16 16L12 20" />
    {/* Sparkles (simplified) */}
    <path d="M5 4L5.5 5" />
    <path d="M19 4L18.5 5" />
    <path d="M5 20L5.5 19" />
    <path d="M19 20L18.5 19" />
  </svg>
);