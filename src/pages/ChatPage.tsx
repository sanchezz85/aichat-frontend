import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { ChatWindow } from '../components/chat';
import { useAuth } from '../hooks/useAuth';

const ChatPage: React.FC = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const { isAuthenticated } = useAuth();

  // Redirect to home if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Redirect to personas if no conversation ID
  if (!conversationId) {
    return <Navigate to="/personas" replace />;
  }

  return (
    <div className="h-screen bg-bg">
      <ChatWindow conversationId={conversationId} />
    </div>
  );
};

export default ChatPage;

