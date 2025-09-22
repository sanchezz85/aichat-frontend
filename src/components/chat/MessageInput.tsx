import React, { useState, useRef, useEffect } from 'react';
import { Send, Smile } from 'lucide-react';
import { Button } from '../ui';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  freeMessagesLeft?: number;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  disabled = false,
  placeholder = 'Type a message...',
  freeMessagesLeft
}) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const canSend = message.trim().length > 0 && !disabled;

  return (
    <div className="border-t border-gray-700 bg-bg-elev-1 p-4">
      {/* Free messages counter */}
      {freeMessagesLeft !== undefined && freeMessagesLeft > 0 && (
        <div className="mb-2 text-center">
          <span className="text-xs text-text-secondary bg-gray-800 px-2 py-1 rounded-full">
            {freeMessagesLeft} free messages left
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-end space-x-3">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className={`
              w-full px-4 py-3 pr-12 rounded-lg resize-none
              bg-bg-elev-2 border border-gray-600
              text-text-primary placeholder:text-text-tertiary
              focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors duration-200
            `}
            style={{ minHeight: '48px', maxHeight: '120px' }}
          />
          
          {/* Emoji button (placeholder for future) */}
          <button
            type="button"
            className="absolute right-3 bottom-3 p-1 text-text-tertiary hover:text-text-secondary transition-colors"
            disabled={disabled}
          >
            <Smile className="w-5 h-5" />
          </button>
        </div>

        <Button
          type="submit"
          size="md"
          disabled={!canSend}
          className="flex-shrink-0"
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>

      {/* Paywall notice */}
      {freeMessagesLeft === 0 && (
        <div className="mt-3 p-3 bg-brand-500/20 border border-brand-500/30 rounded-lg">
          <p className="text-sm text-brand-400 text-center">
            You've used all your free messages. Subscribe to continue chatting!
          </p>
        </div>
      )}
    </div>
  );
};

export default MessageInput;

