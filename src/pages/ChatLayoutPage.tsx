import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ChatSidebar from '../components/chat/ChatSidebar';
import ChatColumn from '../components/chat/ChatColumn';
import PersonaProfile from '../components/chat/PersonaProfile';
import { Layout } from '../components/layout';
import { useUserConversations } from '../hooks/useChat';
import { usePersona } from '../hooks/usePersonas';
import { useCreateConversation } from '../hooks/useChat';
import { Modal, Button } from '../components/ui';
// import removed
import { usePersonas } from '../hooks/usePersonas';

const ChatLayoutPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [showPersonaModal, setShowPersonaModal] = useState(false);

  // Check if we have a conversation ID from navigation state
  useEffect(() => {
    const state = location.state as { selectedConversationId?: string };
    if (state?.selectedConversationId) {
      setSelectedConversationId(state.selectedConversationId);
      // Clear the state to prevent issues on refresh
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate, location.pathname]);
  
  // Fetch user conversations
  const { data: conversations, isLoading: loadingConversations } = useUserConversations();
  
  // Get persona data for the selected conversation
  const selectedConversation = conversations?.find(c => c.id === selectedConversationId);
  const { data: selectedPersona } = usePersona(selectedConversation?.persona_id || '');
  
  // For creating new conversations
  const { data: personas } = usePersonas();
  const createConversationMutation = useCreateConversation();

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
  };

  const handleCreateNewConversation = () => {
    setShowPersonaModal(true);
  };

  const handleSelectPersona = async (personaId: string) => {
    try {
      const newConversation = await createConversationMutation.mutateAsync({
        persona_id: personaId
      });
      
      setSelectedConversationId(newConversation.id);
      setShowPersonaModal(false);
      
      // Optionally refetch conversations to update the sidebar
      // This would happen automatically with React Query if we invalidate the query
    } catch (error) {
      console.error('Failed to create conversation:', error);
      // Handle error - show toast or error message
    }
  };

  return (
    <Layout chatLayout={true}>
      <div className="h-full bg-bg flex overflow-hidden chat-layout">
        {/* Left Sidebar - Conversation List */}
        <ChatSidebar
          conversations={conversations || []}
          selectedConversationId={selectedConversationId}
          onSelectConversation={handleSelectConversation}
          onCreateNewConversation={handleCreateNewConversation}
          loading={loadingConversations}
        />

        {/* Middle Column - Chat Messages */}
        <ChatColumn conversationId={selectedConversationId} />

        {/* Right Sidebar - Persona Profile */}
        <PersonaProfile 
          persona={selectedPersona || null}
          loading={!selectedPersona && !!selectedConversation}
        />
      </div>

      {/* Modal for selecting persona when creating new conversation */}
      <Modal
        isOpen={showPersonaModal}
        onClose={() => setShowPersonaModal(false)}
        title="Choose a Persona"
        size="lg"
      >
        <div className="p-6">
          <p className="text-text-secondary mb-6">
            Select a persona to start a new conversation with:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
            {personas?.map((persona) => (
              <div
                key={persona.id}
                onClick={() => handleSelectPersona(persona.id)}
                className="p-4 border border-gray-600 rounded-lg hover:border-accent cursor-pointer transition-colors bg-bg-secondary hover:bg-bg-hover"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={persona.avatar_url}
                    alt={persona.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-text-primary truncate">
                      {persona.name}
                    </h3>
                    <p className="text-sm text-text-secondary truncate">
                      {persona.description}
                    </p>
                    {/* Difficulty badge removed */}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-600">
            <Button
              variant="secondary"
              onClick={() => setShowPersonaModal(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default ChatLayoutPage;
