
import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {}

export const HistoryIcon: React.FC<IconProps> = (props) => (
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
    <path d="M12 8v4l3 3" />
    <path d="M12 21a9 9 0 1 0-9-9" />
    <path d="M19.34 14.66A9 9 0 1 0 12 21" /> {/* To complete the circle visually when stroke is thick */}
  </svg>
);
