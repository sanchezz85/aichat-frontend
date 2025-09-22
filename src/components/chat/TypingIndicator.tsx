import React from 'react';

interface TypingIndicatorProps {
  className?: string;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ className }) => {
  return (
    <div className={`flex items-center space-x-1 px-3 py-2 ${className}`}>
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce [animation-delay:-0.3s]" />
        <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce [animation-delay:-0.15s]" />
        <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce" />
      </div>
      <span className="text-sm text-text-secondary ml-2">Typing...</span>
    </div>
  );
};

export default TypingIndicator;

