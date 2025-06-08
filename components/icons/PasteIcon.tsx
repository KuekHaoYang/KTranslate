
import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {}

export const PasteIcon: React.FC<IconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20" // Base size, actual size controlled by className if needed
    height="20" // Base size
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2" // Standard stroke width
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
    <path d="M12 11v6"></path>
    <path d="m15 14-3 3-3-3"></path>
  </svg>
);
