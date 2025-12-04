import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { X, ChevronLeft, ChevronRight, Download, Share, Users } from 'lucide-react';
import { Button, Modal } from '../ui';
import MediaItem from './MediaItem';
import { mediaApi, followApi } from '../../services/api';
import { MediaContent } from '../../types';
import { resolveAssetUrl } from '../../config/api';

interface MediaGalleryProps {
  personaId: string;
  personaName?: string;
  isFollowing?: boolean; // Optional: can be passed from parent to avoid refetching
}

interface MediaViewerProps {
  media: MediaContent;
  isOpen: boolean;
  onClose: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
}

const MediaViewer: React.FC<MediaViewerProps> = ({
  media,
  isOpen,
  onClose,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext
}) => {
  // Handle keyboard navigation
  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && hasPrevious && onPrevious) {
        onPrevious();
      } else if (e.key === 'ArrowRight' && hasNext && onNext) {
        onNext();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, hasPrevious, hasNext, onPrevious, onNext, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4">
        <div className="flex items-center justify-between">
          <Button
            variant="tertiary"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="tertiary"
              size="sm"
              className="text-white hover:bg-white/10"
            >
              <Share className="w-4 h-4" />
            </Button>
            <Button
              variant="tertiary"
              size="sm"
              className="text-white hover:bg-white/10"
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Media content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {media.content_type === 'video' ? (
          <video
            src={resolveAssetUrl(media.file_url)}
            controls
            className="max-w-full max-h-full"
            autoPlay
          />
        ) : (
          <img
            src={resolveAssetUrl(media.file_url)}
            alt="Media content"
            className="max-w-full max-h-full object-contain"
          />
        )}
      </div>

      {/* Navigation */}
      {hasPrevious && (
        <button
          onClick={onPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}
      
      {hasNext && (
        <button
          onClick={onNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

const MediaGallery: React.FC<MediaGalleryProps> = ({
  personaId,
  personaName,
  isFollowing: isFollowingProp
}) => {
  const [selectedMedia, setSelectedMedia] = useState<MediaContent | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);

  // Fetch media
  const { data: mediaItems = [], isLoading, error } = useQuery({
    queryKey: ['persona-media', personaId],
    queryFn: () => mediaApi.getPersonaMedia(personaId),
    enabled: !!personaId
  });

  // Fetch follow status if not provided
  const { data: followStatus } = useQuery({
    queryKey: ['follow-status', personaId],
    queryFn: () => followApi.getFollowStatus(personaId),
    enabled: !!personaId && isFollowingProp === undefined
  });

  // Determine if user is following
  const isFollowing = isFollowingProp !== undefined ? isFollowingProp : (followStatus?.isFollowing || false);

  // Separate SFW and NSFW media
  const sfwMedia = mediaItems.filter(media => !media.is_nsfw);
  const nsfwMedia = mediaItems.filter(media => media.is_nsfw);

  const handleViewMedia = (media: MediaContent) => {
    // SFW images can always be viewed
    // NSFW images require following
    if (!media.is_nsfw || isFollowing) {
      setSelectedMedia(media);
      setViewerOpen(true);
    }
  };

  // Get the current category's media list for navigation (SFW or NSFW, but not crossing between them)
  const getCurrentCategoryMedia = () => {
    if (!selectedMedia) return [];
    return selectedMedia.is_nsfw ? nsfwMedia : sfwMedia;
  };

  const handleNavigateViewer = (direction: 'previous' | 'next') => {
    if (!selectedMedia) return;
    
    // Navigate only within the same category (SFW or NSFW)
    const categoryMedia = getCurrentCategoryMedia();
    const currentIndex = categoryMedia.findIndex(item => item.id === selectedMedia.id);
    const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    
    if (newIndex >= 0 && newIndex < categoryMedia.length) {
      const newMedia = categoryMedia[newIndex];
      setSelectedMedia(newMedia);
    }
  };

  const categoryMedia = getCurrentCategoryMedia();
  const currentIndex = selectedMedia ? categoryMedia.findIndex(item => item.id === selectedMedia.id) : -1;
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < categoryMedia.length - 1;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-text-secondary">Loading media...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400 mb-4">Failed to load media</p>
        <Button variant="secondary" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* Header and filters */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <h2 className="text-xl font-semibold text-text-primary mb-2 sm:mb-0">
            Gallery:
          </h2>
          
          
        </div>
      </div>

      {/* Media grid */}
      {mediaItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-text-secondary">
            No media available.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* SFW Section */}
          {sfwMedia.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sfwMedia.map((media) => (
                <MediaItem
                  key={media.id}
                  media={media}
                  onView={handleViewMedia}
                  isLocked={false}
                />
              ))}
            </div>
          )}

          {/* Separator between sections */}
          {sfwMedia.length > 0 && nsfwMedia.length > 0 && (
            <div className="border-t border-gray-700/50" />
          )}

          {/* Friends-only Section (NSFW) */}
          {nsfwMedia.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg">
                  <Users className="w-4 h-4 text-white" />
                  <span className="text-white text-sm font-medium">Only</span>
                </div>
                {!isFollowing && (
                  <span className="text-text-tertiary text-sm">Follow to unlock</span>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {nsfwMedia.map((media) => (
                  <MediaItem
                    key={media.id}
                    media={media}
                    onView={handleViewMedia}
                    isLocked={!isFollowing}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Media Viewer */}
      {selectedMedia && (
        <MediaViewer
          media={selectedMedia}
          isOpen={viewerOpen}
          onClose={() => setViewerOpen(false)}
          onPrevious={() => handleNavigateViewer('previous')}
          onNext={() => handleNavigateViewer('next')}
          hasPrevious={hasPrevious}
          hasNext={hasNext}
        />
      )}
    </div>
  );
};

export default MediaGallery;

