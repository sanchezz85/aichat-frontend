import React from 'react';
import { clsx } from 'clsx';
import { BaseComponentProps } from '../../types';

interface AvatarProps extends BaseComponentProps {
  src?: string;
  alt?: string;
  size?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | '16';
  fallback?: string;
  online?: boolean;
  storyRing?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  size = 'md',
  fallback,
  online,
  storyRing = false,
  className
}) => {
  const [imageError, setImageError] = React.useState(false);

  const sizeClasses = {
    xxs: 'w-4 h-4',
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    '16': 'w-16 h-16',
    xl: 'w-18 h-18',
    xxl: 'w-64 h-64'
  } as const;

  const ringClasses = storyRing 
    ? 'ring-2 ring-gradient-to-r ring-brand-500 ring-accent-500'
    : '';

  const statusSize = {
    xxs: 'w-1.5 h-1.5',
    xs: 'w-2 h-2',
    sm: 'w-2.5 h-2.5',
    md: 'w-3 h-3',
    lg: 'w-3.5 h-3.5',
    '16': 'w-4 h-4',
    xl: 'w-4 h-4',
    xxl: 'w-5 h-5'
  } as const;

  // Generate initials from fallback text
  const initials = fallback 
    ? fallback.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <div className={clsx('relative inline-block', className)}>
      <div className={clsx(
        'rounded-full bg-gray-600 flex items-center justify-center overflow-hidden',
        sizeClasses[size],
        ringClasses
      )}>
        {src && !imageError ? (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-contain"
            onError={() => setImageError(true)}
          />
        ) : (
          <span className={clsx(
            'text-text-primary font-medium',
            size === 'xxs' && 'text-[8px]',
            size === 'xs' && 'text-xs',
            size === 'sm' && 'text-xs',
            size === 'md' && 'text-sm',
            size === 'lg' && 'text-base',
            size === '16' && 'text-base',
            size === 'xl' && 'text-lg',
            size === 'xxl' && 'text-xl'
          )}>
            {initials}
          </span>
        )}
      </div>
      
      {online !== undefined && (
        <div className={clsx(
          'absolute bottom-0 right-0 rounded-full border-2 border-bg',
          statusSize[size],
          online ? 'bg-green-500' : 'bg-gray-400'
        )} />
      )}
    </div>
  );
};

export default Avatar;

