import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Wifi, WifiOff, Trash2 } from 'lucide-react';
import { Avatar, Button, Modal } from '../ui';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import { useConversationMessages } from '../../hooks/useChat';
import { usePersona } from '../../hooks/usePersonas';
import { useWebSocket } from '../../hooks/useWebSocket';
import { chatApi } from '../../services/api';
import { resolveAssetUrl } from '../../config/api';
import { Message, WebSocketMessage } from '../../types';

interface ChatWindowProps {
  conversationId: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ conversationId }) => {
  const navigate = useNavigate();
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  // Gamification state removed
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Get conversation data
  const { data: conversationData, isLoading: loadingMessages } = useConversationMessages(conversationId);
  
  // Get persona data from conversation response
  const personaId = conversationData?.conversation?.persona_id;
  const { data: persona } = usePersona(personaId || '');
  
  // WebSocket connection
  const { isConnected, sendMessage, onMessage } = useWebSocket(conversationId);

  // Initialize messages from API
  useEffect(() => {
    if (conversationData?.messages) {
      setLocalMessages(conversationData.messages);
    }
  }, [conversationData]);

  // Subscribe to WebSocket messages
  useEffect(() => {
    const unsubscribe = onMessage((wsMessage: WebSocketMessage) => {
      if (wsMessage.type === 'typing_indicator') {
        setIsTyping(wsMessage.is_typing || false);
      } else if (wsMessage.type === 'persona_response') {
        // Add AI message to local state
        const newMessage: Message = {
          id: `ws-${Date.now()}`,
          conversation_id: conversationId,
          sender_type: 'persona',
          content: wsMessage.content || '',
          created_at: new Date().toISOString()
        };
        
        setLocalMessages(prev => [...prev, newMessage]);
        setIsTyping(false);
        
        // Gamification updates removed
      }
    });

    return unsubscribe;
  }, [onMessage, conversationId]);

  const handleSendMessage = (content: string) => {
    // Add user message to local state immediately
    const userMessage: Message = {
      id: `local-${Date.now()}`,
      conversation_id: conversationId,
      sender_type: 'user',
      content,
      created_at: new Date().toISOString()
    };
    
    setLocalMessages(prev => [...prev, userMessage]);
    
    // Send via WebSocket
    sendMessage({
      type: 'user_message',
      content
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleAvatarClick = () => {
    if (personaId) {
      navigate(`/personas/${personaId}`);
    }
  };

  const handleDeleteMessages = async () => {
    setIsDeleting(true);
    try {
      await chatApi.deleteAllMessages(conversationId);
      setLocalMessages([]);
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Failed to delete messages:', error);
      // Could add toast notification here
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-bg">
      {/* Header */}
      <div className="bg-bg-elev-1 border-b border-gray-700 px-4 py-0 h-8 min-h-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="tertiary"
              size="sm"
              onClick={handleBack}
              className="p-0.5 -ml-1 h-6"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            
            <button
              onClick={handleAvatarClick}
              className="focus:outline-none focus:ring-2 focus:ring-accent rounded-full transition-opacity hover:opacity-80"
              disabled={!personaId}
            >
              <Avatar
                src={persona?.avatar_url ? resolveAssetUrl(persona.avatar_url) : undefined}
                alt={persona?.name}
                size="xs"
                fallback={persona?.name}
              />
            </button>
            
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="font-semibold text-text-primary truncate text-sm leading-tight">
                  {persona?.name || 'Loading...'}
                </h1>
                {persona?.username && (
                  <span className="text-text-secondary text-xs truncate">({persona.username})</span>
                )}
              </div>
              <div className="flex items-center -mt-0.5">
                <span className={`flex items-center text-xs ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
                  {isConnected ? <Wifi className="w-2.5 h-2.5 mr-1" /> : <WifiOff className="w-2.5 h-2.5 mr-1" />}
                  {isConnected ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          </div>
          
          <Button
            variant="tertiary"
            size="sm"
            className="p-0.5 h-6"
            onClick={() => setShowDeleteModal(true)}
            disabled={localMessages.length === 0}
          >
            <Trash2 className={`w-4 h-4 ${localMessages.length === 0 ? 'text-gray-500' : 'text-white hover:text-gray-200'}`} />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <MessageList
        messages={localMessages}
        loading={loadingMessages}
        personaName={persona?.name}
        className="flex-1"
      />

      {/* Typing indicator */}
      {isTyping && (
        <TypingIndicator className="px-4 py-2" />
      )}

      {/* Input */}
      <MessageInput
        onSendMessage={handleSendMessage}
        disabled={false}
        placeholder={
          isConnected
            ? 'Type a message...'
            : 'Offline. You can type, but sending may not work until reconnected.'
        }
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete All Messages"
        size="sm"
        className="max-w-xs"
      >
        <div className="space-y-3">
          <p className="text-sm text-text-secondary leading-relaxed">
            Are you sure you want to delete all messages in this chat? This action cannot be undone and will reset your progress with {persona?.name}.
          </p>
          
          <div className="flex space-x-2 justify-end pt-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowDeleteModal(false)}
              disabled={isDeleting}
              className="px-3 py-1.5 text-xs"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleDeleteMessages}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 text-xs"
            >
              {isDeleting ? 'Deleting...' : 'Delete All'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ChatWindow;

