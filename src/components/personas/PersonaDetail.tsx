import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { Avatar, Button } from '../ui';
import { MediaGallery } from '../media';
import { PersonaDetail as PersonaDetailType } from '../../types';
import { chatApi } from '../../services/api';
import { resolveAssetUrl } from '../../config/api';

interface PersonaDetailProps {
  persona: PersonaDetailType;
}

const PersonaDetail: React.FC<PersonaDetailProps> = ({ persona }) => {
  const navigate = useNavigate();
  const [isStartingChat, setIsStartingChat] = React.useState(false);

  const startChat = async () => {
    try {
      setIsStartingChat(true);
      const conversation = await chatApi.createConversation({ 
        persona_id: persona.id 
      });
      // Navigate to the new three-column chat layout with this conversation
      navigate('/chat', { state: { selectedConversationId: conversation.id } });
    } catch (error) {
      console.error('Failed to start chat:', error);
    } finally {
      setIsStartingChat(false);
    }
  };

  // Media button removed per design update

  // Gamification progress removed

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-bg-elev-1 rounded-xl p-6 mb-4">
        <div className="flex flex-col items-center text-center space-y-3">
          <h1 className="text-2xl font-bold text-text-primary">{persona.name}</h1>
          <p className="text-text-secondary">{persona.description}</p>
          <Avatar
            src={resolveAssetUrl(persona.avatar_url)}
            alt={persona.name}
            size="xxl"
            fallback={persona.name}
          />
        </div>
      </div>

      {/* Start Chat Button */}
      <div className="flex justify-center mb-4">
        <Button
          onClick={startChat}
          loading={isStartingChat}
          disabled={isStartingChat}
          className="flex items-center"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Start Chat
        </Button>
      </div>

      {/* Personality Info */}
      <div className="bg-bg-elev-1 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">
          About {persona.name}
        </h2>
      </div>

      {/* Media Gallery */}
      <div className="bg-bg-elev-1 rounded-xl p-6">
        <MediaGallery personaId={persona.id} personaName={persona.name} />
      </div>
    </div>
  );
};

export default PersonaDetail;

