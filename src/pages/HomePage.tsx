import React, { useState, useEffect } from 'react';
import { LoginForm, RegisterForm } from '../components/auth';
import { PostFeed, FollowingList } from '../components/personas';
import { useAuth } from '../hooks/useAuth';
import { useFollowedPersonas } from '../hooks/usePersonas';
import { Layout } from '../components/layout';
import { Post } from '../types';
import { postApi } from '../services/api';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // If not authenticated, show auth forms
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Age Gate Notice */}
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6">
            <p className="text-red-400 text-sm text-center">
              ⚠️ You must be 18+ to use this platform
            </p>
          </div>

          {authMode === 'login' ? (
            <LoginForm 
              onSwitchToRegister={() => setAuthMode('register')}
            />
          ) : (
            <RegisterForm 
              onSwitchToLogin={() => setAuthMode('login')}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <AuthenticatedHome />
    </Layout>
  );
};

const AuthenticatedHome: React.FC = () => {
  const { data: followedPersonas, isLoading: followedLoading } = useFollowedPersonas();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Fetch posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedPosts = await postApi.getPosts();
        setPosts(fetchedPosts);
      } catch (err) {
        console.error('Failed to fetch posts:', err);
        setError(err instanceof Error ? err : new Error('Failed to load posts'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPosts();
  }, []);

  return (
    <div className="bg-bg min-h-screen">
      <div className="relative">
        {/* Following List - Independent Left Sidebar */}
        <div className="fixed left-4 top-[110px] w-64 max-h-[calc(100vh-130px)] overflow-y-auto z-10 hidden xl:block">
          <FollowingList 
            personas={followedPersonas || []}
            loading={followedLoading}
          />
        </div>

        {/* Post Feed - Centered */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <PostFeed 
            posts={posts}
            loading={isLoading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;

