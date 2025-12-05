import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Persona } from '../../types';
import { resolveAssetUrl } from '../../config/api';
import { useUserConversations } from '../../hooks/useChat';

interface FollowingListProps {
  personas: Persona[];
  loading?: boolean;
}

const FollowingList: React.FC<FollowingListProps> = ({ personas, loading }) => {
  const navigate = useNavigate();
  const { data: conversations } = useUserConversations();

  const handlePersonaClick = (personaId: string) => {
    // Find the conversation with this persona
    const conversation = conversations?.find(c => c.persona_id === personaId);
    
    if (conversation) {
      // Navigate to chat layout with this conversation selected
      navigate('/chat', { state: { selectedConversationId: conversation.id } });
    } else {
      // If no conversation exists, navigate to chat layout (will need to create one)
      navigate('/chat');
    }
  };

  if (loading) {
    return (
      <div className="bg-bg-elev-1 rounded-lg p-4 border border-gray-700">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Following:</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-20 mx-auto"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (personas.length === 0) {
    return (
      <div className="bg-bg-elev-1 rounded-lg p-4 border border-gray-700">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Following:</h3>
        <p className="text-text-secondary text-sm text-center">
          You are not following any personas yet. Send messages to start following!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-bg-elev-1 rounded-lg p-4 border border-gray-700">
      <h3 className="text-lg font-semibold text-text-primary mb-4">Following:</h3>
      <div className="space-y-4">
        {personas.map((persona) => (
          <div
            key={persona.id}
            className="flex flex-col items-center cursor-pointer transition-transform hover:scale-105"
            onClick={() => handlePersonaClick(persona.id)}
          >
            <div className="relative w-16 h-16 mb-2">
              <img
                src={resolveAssetUrl(persona.avatar_url)}
                alt={persona.name}
                className="w-full h-full rounded-full object-cover border-2 border-primary-500 hover:border-primary-400 transition-colors"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
            <span className="text-text-primary text-sm font-medium text-center">
              {persona.name} <span className="text-text-secondary font-normal">({persona.username})</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FollowingList;

