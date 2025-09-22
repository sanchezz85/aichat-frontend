import React, { useEffect, useRef } from 'react';
import { Avatar } from '../ui';
import { Message, SenderType } from '../../types';

// Simple time formatter
const formatTimeAgo = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

interface MessageBubbleProps {
  message: Message;
  personaName?: string;
  personaAvatar?: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  personaName, 
  personaAvatar 
}) => {
  const isUser = message.sender_type === 'user';
  const timestamp = formatTimeAgo(message.created_at);

  if (isUser) {
    return (
      <div className="flex justify-end mb-4">
        <div className="max-w-xs lg:max-w-md">
          <div className="bg-brand-600 text-white px-4 py-2 rounded-2xl rounded-br-md">
            <p className="text-sm">{message.content}</p>
          </div>
          <p className="text-xs text-text-tertiary mt-1 text-right">
            {timestamp}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start space-x-2 mb-4">
      <Avatar
        src={personaAvatar}
        alt={personaName}
        size="sm"
        fallback={personaName}
      />
      <div className="max-w-xs lg:max-w-md">
        <div className="bg-bg-elev-1 text-text-primary px-4 py-2 rounded-2xl rounded-bl-md">
          <p className="text-sm">{message.content}</p>
        </div>
        <p className="text-xs text-text-tertiary mt-1">
          {personaName} • {timestamp}
        </p>
      </div>
    </div>
  );
};

interface MessageListProps {
  messages: Message[];
  loading?: boolean;
  personaName?: string;
  personaAvatar?: string;
  className?: string;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  loading = false,
  personaName,
  personaAvatar,
  className
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (loading) {
    return (
      <div className={`flex-1 flex items-center justify-center ${className}`}>
        <div className="text-text-secondary">
          <div className="animate-pulse">Loading messages...</div>
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className={`flex-1 flex flex-col items-center justify-center p-6 ${className}`}>
        <div className="text-center">
          <div className="mb-4">
            {personaAvatar && (
              <Avatar
                src={personaAvatar}
                alt={personaName}
                size="xl"
                fallback={personaName}
              />
            )}
          </div>
          <h3 className="text-lg font-medium text-text-primary mb-2">
            Start a conversation with {personaName}
          </h3>
          <p className="text-text-secondary text-sm max-w-sm">
            Send a message to begin chatting. Be friendly and engaging to earn charm points!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex-1 overflow-y-auto p-4 ${className}`}>
      <div className="space-y-1">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            personaName={personaName}
            personaAvatar={personaAvatar}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageList;
