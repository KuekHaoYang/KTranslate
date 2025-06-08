import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {}

export const CheckIcon: React.FC<IconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5" // Slightly bolder
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="16.5 5.5 8.5 13.5 3.5 8.5" />
  </svg>
);