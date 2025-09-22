import React from 'react';
import { clsx } from 'clsx';
import { BaseComponentProps } from '../../types';

interface ProgressBarProps extends BaseComponentProps {
  value: number;
  max: number;
  label?: string;
  showValue?: boolean;
  color?: 'brand' | 'accent' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max,
  label,
  showValue = false,
  color = 'brand',
  size = 'md',
  animated = false,
  className
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  const colorClasses = {
    brand: 'bg-brand-500',
    accent: 'bg-accent-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500'
  };

  const trackClass = 'bg-gray-700 bg-opacity-50';

  return (
    <div className={clsx('w-full', className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1">
          {label && (
            <span className="text-sm font-medium text-text-primary">
              {label}
            </span>
          )}
          {showValue && (
            <span className="text-sm text-text-secondary">
              {value}/{max}
            </span>
          )}
        </div>
      )}
      
      <div className={clsx(
        'w-full rounded-full overflow-hidden',
        sizeClasses[size],
        trackClass
      )}>
        <div
          className={clsx(
            'h-full rounded-full transition-all duration-300 ease-out',
            colorClasses[color],
            animated && 'animate-pulse'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;

