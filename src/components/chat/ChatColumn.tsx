import React from 'react';
import ChatWindow from './ChatWindow';

interface ChatColumnProps {
  conversationId: string | null;
}

const ChatColumn: React.FC<ChatColumnProps> = ({ conversationId }) => {
  return (
    <div className="flex-1 min-w-0">
      {conversationId ? (
        <ChatWindow conversationId={conversationId} />
      ) : (
        <div className="h-full flex items-center justify-center text-text-secondary">
          Select a conversation to start chatting
        </div>
      )}
    </div>
  );
};

export default ChatColumn;
