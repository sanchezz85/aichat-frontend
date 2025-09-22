import React from 'react';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';
import { BaseComponentProps } from '../../types';

type NativeButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

type ButtonProps = Omit<NativeButtonProps, 'className' | 'children'> &
  BaseComponentProps & {
    variant?: 'primary' | 'secondary' | 'tertiary' | 'destructive';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    fullWidth?: boolean;
  };

const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  type = 'button',
  ...props
}) => {
  const baseClasses = [
    'inline-flex items-center justify-center font-medium rounded-lg',
    'transition-all duration-200 ease-in-out',
    'focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:ring-offset-bg',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none',
    fullWidth && 'w-full'
  ];

  const variantClasses = {
    primary: [
      'bg-brand-500 text-white shadow-1',
      'hover:bg-brand-600 hover:shadow-2',
      'active:bg-brand-700 active:scale-[0.98]',
      'disabled:bg-brand-500'
    ],
    secondary: [
      'bg-transparent text-text-primary border border-gray-600',
      'hover:bg-gray-800 hover:border-gray-500',
      'active:bg-gray-700',
      'disabled:border-gray-700'
    ],
    tertiary: [
      'bg-transparent text-text-secondary',
      'hover:text-text-primary hover:underline',
      'active:text-brand-500',
      'disabled:text-text-tertiary'
    ],
    destructive: [
      'bg-red-500 text-white shadow-1',
      'hover:bg-red-600 hover:shadow-2',
      'active:bg-red-700 active:scale-[0.98]',
      'disabled:bg-red-500'
    ]
  };

  const sizeClasses = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-12 px-4 text-md',
    lg: 'h-14 px-6 text-lg'
  };

  return (
    <button
      type={type}
      className={clsx(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      )}
      {children}
    </button>
  );
};

export default Button;

