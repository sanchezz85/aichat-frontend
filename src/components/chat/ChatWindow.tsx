import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MoreVertical, Wifi, WifiOff } from 'lucide-react';
import { Avatar, Button, ProgressBar } from '../ui';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import { useConversationMessages } from '../../hooks/useChat';
import { usePersona } from '../../hooks/usePersonas';
import { useWebSocket } from '../../hooks/useWebSocket';
import { Message, WebSocketMessage } from '../../types';

interface ChatWindowProps {
  conversationId: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ conversationId }) => {
  const navigate = useNavigate();
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [charmPoints, setCharmPoints] = useState(0);
  const [unlockLevel, setUnlockLevel] = useState(0);
  const [freeMessagesLeft, setFreeMessagesLeft] = useState(10); // Mock free messages

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
      setCharmPoints(conversationData.conversation_progress.charm_points_earned || 0);
      setUnlockLevel(conversationData.conversation_progress.unlock_level || 0);
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
        
        // Update progress
        if (wsMessage.charm_points_gained) {
          setCharmPoints(prev => prev + wsMessage.charm_points_gained!);
        }
        if (wsMessage.unlock_level !== undefined) {
          setUnlockLevel(wsMessage.unlock_level);
        }
        
        // Decrease free messages
        setFreeMessagesLeft(prev => Math.max(0, prev - 1));
      }
    });

    return unsubscribe;
  }, [onMessage, conversationId]);

  const handleSendMessage = (content: string) => {
    if (freeMessagesLeft <= 0) {
      // Show paywall or subscription modal
      return;
    }

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

  const charmPointsProgress = persona ? (charmPoints / persona.unlock_requirements.charm_points) * 100 : 0;

  return (
    <div className="h-full flex flex-col bg-bg">
      {/* Header */}
      <div className="bg-bg-elev-1 border-b border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="tertiary"
              size="sm"
              onClick={handleBack}
              className="p-2 -ml-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            
            <Avatar
              src={persona?.avatar_url}
              alt={persona?.name}
              size="sm"
              fallback={persona?.name}
            />
            
            <div className="min-w-0">
              <h1 className="font-semibold text-text-primary truncate">
                {persona?.name || 'Loading...'}
              </h1>
              <div className="flex items-center space-x-2">
                <span className={`flex items-center text-xs ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
                  {isConnected ? <Wifi className="w-3 h-3 mr-1" /> : <WifiOff className="w-3 h-3 mr-1" />}
                  {isConnected ? 'Online' : 'Offline'}
                </span>
                {charmPoints > 0 && (
                  <span className="text-xs text-accent-400">
                    ✨ {charmPoints} points
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <Button
            variant="tertiary"
            size="sm"
            className="p-2"
          >
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Progress bar */}
        {persona && charmPoints < persona.unlock_requirements.charm_points && (
          <div className="mt-3">
            <ProgressBar
              value={charmPoints}
              max={persona.unlock_requirements.charm_points}
              label="Charm Progress"
              color="accent"
              size="sm"
            />
          </div>
        )}
      </div>

      {/* Messages */}
      <MessageList
        messages={localMessages}
        loading={loadingMessages}
        personaName={persona?.name}
        personaAvatar={persona?.avatar_url}
        className="flex-1"
      />

      {/* Typing indicator */}
      {isTyping && (
        <TypingIndicator className="px-4 py-2 border-t border-gray-700" />
      )}

      {/* Input */}
      <MessageInput
        onSendMessage={handleSendMessage}
        disabled={freeMessagesLeft <= 0}
        placeholder={
          isConnected
            ? 'Type a message...'
            : 'Offline. You can type, but sending may not work until reconnected.'
        }
        freeMessagesLeft={freeMessagesLeft}
      />
    </div>
  );
};

export default ChatWindow;

