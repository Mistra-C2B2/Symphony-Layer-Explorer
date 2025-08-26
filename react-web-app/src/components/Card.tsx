import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  padding = 'md',
  onClick
}) => {
  const baseClasses = 'bg-white/95 backdrop-blur-sm rounded-2xl border-0 transition-all duration-300';
  const hoverClasses = hover ? 'shadow-xl hover:shadow-2xl hover:-translate-y-2 cursor-pointer' : 'shadow-xl';
  const interactiveClasses = onClick ? 'cursor-pointer' : '';
  
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <div
      className={`${baseClasses} ${hoverClasses} ${interactiveClasses} ${paddingClasses[padding]} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;