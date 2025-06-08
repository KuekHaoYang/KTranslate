
import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {}

export const ClearIcon: React.FC<IconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20" // Base size, actual size controlled by className
    height="20" // Base size, actual size controlled by className
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.25" // Adjusted for better visibility at smaller sizes
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
