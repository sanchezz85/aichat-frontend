import React, { useState } from 'react';
import { LoginForm, RegisterForm } from '../components/auth';
import { PersonaList } from '../components/personas';
import { useAuth } from '../hooks/useAuth';
import { usePersonas } from '../hooks/usePersonas';
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
  const { user } = useAuth();

  return (
    <div className="bg-bg">
      {/* Welcome Header */}
      <div className="bg-bg-elev-1 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Welcome to Nova
            </h1>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Connect with AI personas in immersive, gamified conversations. 
              Build relationships, unlock content, and explore your fantasies in a safe environment.
            </p>
          </div>
        </div>
      </div>

      {/* User Stats */}
      {user && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-bg-elev-1 rounded-xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-text-primary mb-1">
                  Hello, {user.username}! ✨
                </h2>
                <p className="text-text-secondary">
                  You have {user.charm_points} charm points
                </p>
              </div>
              
              <div className="mt-4 sm:mt-0 flex items-center space-x-6 text-sm text-text-secondary">
                <div className="text-center">
                  <div className="text-lg font-semibold text-text-primary">{user.charm_points}</div>
                  <div>Charm Points</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-text-primary">0</div>
                  <div>Active Chats</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-text-primary">0</div>
                  <div>Unlocked Content</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Featured Personas */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-text-primary mb-2">
            Featured Personas
          </h2>
          <p className="text-text-secondary">
            Start chatting with our AI personas. Each has their own personality and unlockable content.
          </p>
        </div>

        <PersonaList 
          personas={personas || []}
          loading={isLoading}
          error={error}
          layout="grid"
        />
      </div>

      {/* How it Works */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            How Nova Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-brand-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💬</span>
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Start Chatting
            </h3>
            <p className="text-text-secondary text-sm">
              Choose a persona and begin your conversation. Each message earns you charm points.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-accent-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✨</span>
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Earn Charm Points
            </h3>
            <p className="text-text-secondary text-sm">
              Engage meaningfully to earn charm points. The better your conversation, the more points you get.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-green-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔓</span>
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Unlock Content
            </h3>
            <p className="text-text-secondary text-sm">
              Use charm points and time spent chatting to unlock exclusive photos and content.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

