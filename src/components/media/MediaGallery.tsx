import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { X, ChevronLeft, ChevronRight, Download, Share } from 'lucide-react';
import { Button, Modal } from '../ui';
import MediaItem from './MediaItem';
import { mediaApi } from '../../services/api';
import { MediaContent } from '../../types';

interface MediaGalleryProps {
  personaId: string;
  personaName?: string;
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
            src={media.file_url}
            controls
            className="max-w-full max-h-full"
            autoPlay
          />
        ) : (
          <img
            src={media.file_url}
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
  personaName
}) => {
  const [selectedMedia, setSelectedMedia] = useState<MediaContent | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  // Filters simplified

  // Fetch media
  const { data: mediaItems = [], isLoading, error } = useQuery({
    queryKey: ['persona-media', personaId],
    queryFn: () => mediaApi.getPersonaMedia(personaId),
    enabled: !!personaId
  });

  // Filter media
  const filteredMedia = mediaItems; // no lock filtering

  const handleViewMedia = (media: MediaContent) => {
    setSelectedMedia(media);
    setViewerOpen(true);
  };

  const handleUnlockMedia = (media: MediaContent) => {
    // Unlock removed
  };

  const handleNavigateViewer = (direction: 'previous' | 'next') => {
    if (!selectedMedia) return;
    
    const currentIndex = filteredMedia.findIndex(item => item.id === selectedMedia.id);
    const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    
    if (newIndex >= 0 && newIndex < filteredMedia.length) {
      const newMedia = filteredMedia[newIndex];
      if (newMedia.is_unlocked) {
        setSelectedMedia(newMedia);
      }
    }
  };

  const currentIndex = selectedMedia ? filteredMedia.findIndex(item => item.id === selectedMedia.id) : -1;
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < filteredMedia.length - 1;

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
            {personaName ? `${personaName}'s Media` : 'Media Gallery'}
          </h2>
          
          
        </div>
      </div>

      {/* Media grid */}
      {filteredMedia.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-text-secondary">
            No media available.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredMedia.map((media) => (
            <MediaItem
              key={media.id}
              media={media}
              onView={handleViewMedia}
              onUnlock={handleUnlockMedia}
            />
          ))}
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

