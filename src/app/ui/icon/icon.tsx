import React from 'react';

interface IconProps {
  iconId: string;
  className: string
  color?: string;  // Color prop for dynamic color change
}

const Icon: React.FC<IconProps> = ({ iconId, color , className }) => (
  <svg width="24" height="24" className={className}>
    {/* Pass the color dynamically to the symbol */}
    <use href={`/icons.svg#${iconId}`} fill={color} stroke={color} />
  </svg>
);

export default Icon;
