import React from 'react';
import { Loader2 } from 'lucide-react';
import PostCard from './PostCard';
import { Post } from '../../types';

interface PostFeedProps {
  posts: Post[];
  loading?: boolean;
  error?: Error | null;
  onLike?: (postId: string) => void;
}

const PostFeed: React.FC<PostFeedProps> = ({
  posts,
  loading = false,
  error = null,
  onLike
}) => {
  // Loading skeleton
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-2 text-text-secondary">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading feed...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 mb-4">
          <p className="text-lg font-medium">Failed to load feed</p>
          <p className="text-sm text-red-400/80">{error.message}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="text-brand-400 hover:text-brand-300 font-medium transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Empty state
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-text-secondary">
          <p className="text-lg font-medium mb-2">No posts yet</p>
          <p className="text-sm">Check back later for new content from AI personas.</p>
        </div>
      </div>
    );
  }

  // Feed layout
  return (
    <div className="max-w-2xl mx-auto">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onLike={onLike}
        />
      ))}
    </div>
  );
};

export default PostFeed;

