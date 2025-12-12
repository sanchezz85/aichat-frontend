import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { Avatar, Button } from '../ui';
import { MediaGallery } from '../media';
import { PersonaDetail as PersonaDetailType, FollowStatus } from '../../types';
import { chatApi, followApi } from '../../services/api';
import { resolveAssetUrl } from '../../config/api';

interface PersonaDetailProps {
  persona: PersonaDetailType;
}

const PersonaDetail: React.FC<PersonaDetailProps> = ({ persona }) => {
  const navigate = useNavigate();
  const [isStartingChat, setIsStartingChat] = useState(false);
  const [followStatus, setFollowStatus] = useState<FollowStatus | null>(null);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    if (persona) {
      loadFollowStatus();
    }
  }, [persona?.id]);

  // Poll for follow status updates when status is PENDING
  useEffect(() => {
    if (!followStatus || followStatus.status !== 'PENDING') {
      return;
    }

    const pollInterval = setInterval(() => {
      loadFollowStatus();
    }, 5000); // Check every 5 seconds

    return () => clearInterval(pollInterval);
  }, [followStatus?.status, persona?.id]);

  const loadFollowStatus = async () => {
    if (!persona) return;
    try {
      const status = await followApi.getFollowStatus(persona.id);
      setFollowStatus(status);
    } catch (error) {
      console.error('Error loading follow status:', error);
    }
  };

  const handleFollowClick = async () => {
    if (!persona || followLoading) return;
    
    setFollowLoading(true);
    try {
      const status = await followApi.createFollowRequest(persona.id);
      setFollowStatus(status);
    } catch (error) {
      console.error('Error creating follow request:', error);
    } finally {
      setFollowLoading(false);
    }
  };

  const getFollowButtonText = () => {
    if (!followStatus || !followStatus.status) return 'Follow';
    if (followStatus.status === 'PENDING') return 'Request Sent';
    if (followStatus.status === 'CONFIRMED') return 'Following';
    return 'Follow';
  };

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
      <div className="bg-bg-elev-1 rounded-xl p-4 mb-3">
        <div className="flex flex-col items-center text-center space-y-2">
          <h1 className="text-2xl font-bold text-text-primary">{persona.name}</h1>
          <p className="text-text-tertiary text-sm -mt-0.5">{persona.username}</p>
          <p className="text-text-secondary">{persona.description}</p>
          <Avatar
            src={resolveAssetUrl(persona.avatar_url)}
            alt={persona.name}
            size="xxl"
            fallback={persona.name}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-2 mb-3">
        <Button
          onClick={handleFollowClick}
          variant={followStatus?.isFollowing ? 'secondary' : 'primary'}
          disabled={followLoading || followStatus?.status === 'PENDING'}
          className="min-w-[120px]"
        >
          {followLoading ? 'Loading...' : getFollowButtonText()}
        </Button>
        <Button
          onClick={startChat}
          loading={isStartingChat}
          disabled={isStartingChat}
          className="flex items-center"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Chat
        </Button>
      </div>

      {/* Personality Info */}
      <div className="bg-bg-elev-1 rounded-xl p-4 mb-3">
        <h2 className="text-lg font-semibold text-text-primary mb-3">
          About:
        </h2>
        {persona.interests && (
          <div className="space-y-2">
            <p className="text-text-primary">{persona.interests}</p>
          </div>
        )}
      </div>

      {/* Media Gallery */}
      <div className="bg-bg-elev-1 rounded-xl p-4">
        <MediaGallery 
          personaId={persona.id} 
          personaName={persona.name}
          isFollowing={followStatus?.isFollowing || false}
        />
      </div>
    </div>
  );
};

export default PersonaDetail;

