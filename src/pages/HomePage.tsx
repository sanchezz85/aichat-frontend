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


    </div>
  );
};

export default HomePage;

