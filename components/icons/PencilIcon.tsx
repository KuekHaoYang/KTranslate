import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {}

export const PencilIcon: React.FC<IconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M17.5 2.5a2.121 2.121 0 0 1 3 3L7.5 18.5H4.5v-3L17.5 2.5z" />
    <path d="m15 5 3 3" />
  </svg>
);