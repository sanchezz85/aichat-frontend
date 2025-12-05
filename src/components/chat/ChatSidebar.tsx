import React from 'react';
import { Avatar } from '../ui';
import { Conversation } from '../../types';
import { resolveAssetUrl } from '../../config/api';

interface ChatSidebarProps {
  conversations: Conversation[];
  selectedConversationId: string | null;
  onSelectConversation: (conversationId: string) => void;
  onCreateNewConversation: () => void;
  loading?: boolean;
}

const formatTimeAgo = (dateString?: string): string => {
  if (!dateString) return '';
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
  return `${Math.floor(diffInSeconds / 86400)}d`;
};

const ChatSidebar: React.FC<ChatSidebarProps> = (props) => {
  const {
    conversations,
    selectedConversationId,
    onSelectConversation,
    loading = false
  } = props;

  return (
    <div className="w-[24.3rem] bg-bg-secondary border-r border-gray-700 h-full flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-text-primary font-semibold">Conversations</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto chat-scrollable">
        {loading ? (
          <div className="p-4 text-text-secondary">Loading...</div>
        ) : conversations.length === 0 ? (
          <div className="p-6 text-text-secondary text-sm">No conversations yet.</div>
        ) : (
          <ul className="divide-y divide-gray-700">
            {conversations.map((conv) => {
              const isSelected = conv.id === selectedConversationId;
              return (
                <li key={conv.id}>
                  <button
                    onClick={() => onSelectConversation(conv.id)}
                    className={`w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-bg-hover transition-colors ${
                      isSelected ? 'bg-bg-elev-1' : ''
                    }`}
                  >
                    <Avatar src={resolveAssetUrl(conv.persona_avatar_url)} alt={conv.persona_name} size="xs" fallback={conv.persona_name} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium text-text-primary truncate">
                          {conv.persona_name} <span className="font-normal text-text-secondary">({conv.persona_username})</span>
                        </span>
                        <span className="text-xs text-text-tertiary flex-shrink-0">
                          {formatTimeAgo(conv.last_message_at)}
                        </span>
                      </div>
                      <p className="text-xs text-text-secondary truncate">
                        {conv.last_message || 'Start a conversation'}
                      </p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
