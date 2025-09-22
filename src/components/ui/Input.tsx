import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { BaseComponentProps } from '../../types';

interface InputProps extends BaseComponentProps, Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  showPasswordToggle?: boolean;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  className,
  label,
  error,
  helperText,
  showPasswordToggle = false,
  fullWidth = false,
  size = 'md',
  type = 'text',
  disabled = false,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [inputType, setInputType] = React.useState(type);

  React.useEffect(() => {
    if (showPasswordToggle && type === 'password') {
      setInputType(showPassword ? 'text' : 'password');
    } else {
      setInputType(type);
    }
  }, [showPassword, type, showPasswordToggle]);

  const baseClasses = [
    'border rounded-lg transition-colors duration-200',
    'placeholder:text-text-tertiary',
    'focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent',
    'disabled:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50',
    fullWidth && 'w-full'
  ];

  const sizeClasses = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-11 px-3 text-md',
    lg: 'h-12 px-4 text-lg'
  };

  const stateClasses = error 
    ? 'border-red-500 bg-red-50/10 text-text-primary'
    : 'border-gray-600 bg-bg-elev-1 text-text-primary hover:border-gray-500';

  return (
    <div className={fullWidth ? 'w-full' : undefined}>
      {label && (
        <label className="block text-sm font-medium text-text-primary mb-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        <input
          ref={ref}
          type={inputType}
          disabled={disabled}
          className={clsx(
            baseClasses,
            sizeClasses[size],
            stateClasses,
            showPasswordToggle && 'pr-10',
            className
          )}
          {...props}
        />
        
        {showPasswordToggle && type === 'password' && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-text-tertiary hover:text-text-secondary" />
            ) : (
              <Eye className="h-4 w-4 text-text-tertiary hover:text-text-secondary" />
            )}
          </button>
        )}
      </div>
      
      {(error || helperText) && (
        <div className="mt-1 flex items-center">
          {error && <AlertCircle className="h-4 w-4 text-red-500 mr-1" />}
          <p className={clsx(
            'text-sm',
            error ? 'text-red-500' : 'text-text-secondary'
          )}>
            {error || helperText}
          </p>
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;

