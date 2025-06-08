
import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {}

export const SwapIcon: React.FC<IconProps> = (props) => (
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
    <polyline points="16 3 21 3 21 8" />
    <line x1="4" y1="20" x2="21" y2="3" />
    <polyline points="8 21 3 21 3 16" />
    <line x1="15" y1="15" x2="3" y2="3" /> {/* Modified this line for a clearer swap visual */}
  </svg>
);
