import React, { useState } from 'react';
import { LoginForm, RegisterForm } from '../components/auth';
import { PersonaList, FollowingList } from '../components/personas';
import { useAuth } from '../hooks/useAuth';
import { usePersonas, useFollowedPersonas } from '../hooks/usePersonas';
import { Layout } from '../components/layout';

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
  const { data: personas, isLoading, error } = usePersonas();
  const { data: followedPersonas, isLoading: followedLoading } = useFollowedPersonas();
  const { user } = useAuth();
  return (
    <div className="bg-bg">
      <div className="relative">
        {/* Following List - Independent Left Sidebar */}
        <div className="fixed left-4 top-[110px] w-64 max-h-[calc(100vh-130px)] overflow-y-auto z-10">
          <FollowingList 
            personas={followedPersonas || []}
            loading={followedLoading}
          />
        </div>

        {/* Featured Personas - Aligned with Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
   

          <PersonaList 
            personas={personas || []}
            loading={isLoading}
            error={error}
            layout="grid"
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;

