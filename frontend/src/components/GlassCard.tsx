import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: 'purple' | 'blue' | 'pink' | 'none';
  onClick?: () => void;
}

export default function GlassCard({ children, className, glow = 'none', onClick }: GlassCardProps) {
  const glowClasses = {
    purple: 'shadow-glow-purple border-purple-500/20',
    blue: 'shadow-glow-blue border-blue-400/20',
    pink: 'shadow-glow-pink border-pink-400/20',
    none: 'border-white/8',
  };

  return (
    <div
      className={cn(
        'glass-card rounded-2xl transition-all duration-300',
        glowClasses[glow],
        onClick && 'cursor-pointer hover:scale-[1.01]',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
