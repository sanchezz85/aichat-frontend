import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Briefcase, User } from 'lucide-react';
import { Avatar, Badge, Button } from '../ui';
import { MediaGallery } from '../media';
import { resolveAssetUrl } from '../../config/api';
import { PersonaDetail, FollowStatus } from '../../types';
import { followApi } from '../../services/api';

interface PersonaProfileProps {
  persona: PersonaDetail | null;
  loading?: boolean;
}

const PersonaProfile: React.FC<PersonaProfileProps> = ({ persona, loading = false }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'about' | 'gallery'>('gallery');
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

  const handleAvatarClick = () => {
    if (persona) {
      navigate(`/personas/${persona.id}`);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 min-w-0 bg-bg-secondary border-l border-gray-700 h-full chat-scrollable">
        <div className="p-6">
          <div className="animate-pulse space-y-6">
            <div className="w-64 h-64 bg-gray-600 rounded-full mx-auto"></div>
            <div className="space-y-4">
              <div className="h-6 bg-gray-600 rounded w-3/4 mx-auto"></div>
              <div className="h-4 bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-700 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!persona) {
    return (
      <div className="flex-1 min-w-0 bg-bg-secondary border-l border-gray-700 h-full chat-scrollable">
        <div className="p-6">
          <div className="text-center text-text-secondary">
            <div className="w-64 h-64 mx-auto mb-4 rounded-full bg-gray-700 flex items-center justify-center">
              <User size={80} />
            </div>
            <p className="text-sm">Select a conversation to view persona profile</p>
          </div>
        </div>
      </div>
    );
  }

  // Placeholder meta values until extended profile fields are provided by backend
  const personaDetails = {
    age: undefined as number | undefined,
    location: undefined as string | undefined,
    occupation: undefined as string | undefined,
    interests: [] as string[]
  };


  return (
    <div className="flex-1 min-w-0 bg-bg-secondary border-l border-gray-700 h-full chat-scrollable">
      {/* Header with persona image and basic info */}
      <div className="p-6 border-b border-gray-700">
        <div className="text-center mb-2">
          <div className="relative inline-block mb-4">
            <button
              onClick={handleAvatarClick}
              className="focus:outline-none focus:ring-2 focus:ring-accent rounded-full transition-opacity hover:opacity-80 cursor-pointer"
            >
              <Avatar
                src={resolveAssetUrl(persona.avatar_url)}
                alt={persona.name}
                size="xxl"
                fallback={persona.name}
              />
            </button>
          </div>
          
          <h2 className="text-2xl font-bold text-text-primary mb-1">{persona.name}</h2>
          {persona.username && (
            <p className="text-sm text-text-tertiary mb-2">{persona.username}</p>
          )}
          
          <p className="text-sm text-text-secondary leading-relaxed mb-3">
            {persona.description}
          </p>

          {/* Follow Button */}
          <div className="flex justify-center mt-2">
            <Button
              onClick={handleFollowClick}
              variant={followStatus?.isFollowing ? 'secondary' : 'primary'}
              disabled={followLoading || followStatus?.status === 'PENDING'}
              className="min-w-[120px]"
            >
              {followLoading ? 'Loading...' : getFollowButtonText()}
            </Button>
          </div>
        </div>

      </div>

      {/* Tabs */}
      <div className="border-b border-gray-700">
        <div className="flex">
          <button
            onClick={() => setActiveTab('gallery')}
            className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
              activeTab === 'gallery'
                ? 'text-accent border-b-2 border-accent'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Gallery
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
              activeTab === 'about'
                ? 'text-accent border-b-2 border-accent'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            About
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'about' ? (
          <div className="p-4 space-y-4">
            {/* Basic Info */}
            <div>
              {persona.interests && (
                <div className="space-y-2">
                  <p className="text-text-primary">{persona.interests}</p>
                </div>
              )}
            </div>

          </div>
        ) : (
          <div className="p-4">
            <MediaGallery 
              personaId={persona.id}
              personaName={persona.name}
              isFollowing={followStatus?.isFollowing || false}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonaProfile;
