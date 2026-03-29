'use client';

import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
  hover?: boolean;
}

export default function Card({ children, className = '', glow = false, hover = false }: CardProps) {
  return (
    <div
      className={`
        glass-card rounded-2xl p-6
        ${glow ? 'glow-accent' : ''}
        ${hover ? 'hover-lift cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
