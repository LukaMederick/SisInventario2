import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  variant?: 'solid' | 'subtle' | 'outline';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  color = '#64748b',
  variant = 'subtle',
  className = '',
}) => {
  // Preset styles based on common state names if color not explicitly matched
  let bgStyle = { backgroundColor: `${color}18`, color: color, borderColor: `${color}40` };
  
  if (variant === 'solid') {
    bgStyle = { backgroundColor: color, color: '#ffffff', borderColor: color };
  } else if (variant === 'outline') {
    bgStyle = { backgroundColor: 'transparent', color: color, borderColor: color };
  }

  return (
    <span
      style={bgStyle}
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${className}`}
    >
      <span
        className="w-1.5 h-1.5 rounded-full mr-1.5"
        style={{ backgroundColor: variant === 'solid' ? '#ffffff' : color }}
      />
      {children}
    </span>
  );
};

