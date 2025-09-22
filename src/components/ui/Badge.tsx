import React from 'react';
import { clsx } from 'clsx';
import { Feather, Circle, Flame, Lock } from 'lucide-react';
import { BaseComponentProps } from '../../types';

interface BadgeProps extends BaseComponentProps {
  variant?: 'difficulty' | 'status' | 'default';
  difficulty?: 'easy' | 'medium' | 'hard';
  status?: 'locked' | 'unlocked' | 'new' | 'trending';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'default',
  difficulty,
  status,
  size = 'md',
  icon
}) => {
  const baseClasses = [
    'inline-flex items-center rounded-full font-medium',
    'transition-colors duration-200'
  ];

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm'
  };

  // Difficulty variant
  if (variant === 'difficulty' && difficulty) {
    const difficultyConfig = {
      easy: {
        classes: 'bg-green-500/20 text-green-400 border border-green-500/30',
        icon: <Feather className="w-3 h-3 mr-1" />
      },
      medium: {
        classes: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
        icon: <Circle className="w-3 h-3 mr-1" />
      },
      hard: {
        classes: 'bg-red-500/20 text-red-400 border border-red-500/30',
        icon: <Flame className="w-3 h-3 mr-1" />
      }
    };

    const config = difficultyConfig[difficulty];

    return (
      <span className={clsx(
        baseClasses,
        sizeClasses[size],
        config.classes,
        className
      )}>
        {config.icon}
        {children || difficulty}
      </span>
    );
  }

  // Status variant
  if (variant === 'status' && status) {
    const statusConfig = {
      locked: {
        classes: 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
        icon: <Lock className="w-3 h-3 mr-1" />
      },
      unlocked: {
        classes: 'bg-green-500/20 text-green-400 border border-green-500/30',
        icon: null
      },
      new: {
        classes: 'bg-brand-500/20 text-brand-400 border border-brand-500/30',
        icon: null
      },
      trending: {
        classes: 'bg-accent-500/20 text-accent-400 border border-accent-500/30',
        icon: null
      }
    };

    const config = statusConfig[status];

    return (
      <span className={clsx(
        baseClasses,
        sizeClasses[size],
        config.classes,
        className
      )}>
        {config.icon}
        {children || status}
      </span>
    );
  }

  // Default variant
  return (
    <span className={clsx(
      baseClasses,
      sizeClasses[size],
      'bg-gray-500/20 text-gray-300 border border-gray-500/30',
      className
    )}>
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </span>
  );
};

export default Badge;

