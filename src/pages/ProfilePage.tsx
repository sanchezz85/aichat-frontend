import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Settings, LogOut, MessageSquare, Image } from 'lucide-react';
import { Button, Avatar, Modal } from '../components/ui';
import { useAuth } from '../hooks/useAuth';

const ProfilePage: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Redirect to home if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  const handleLogout = () => {
    logout();
    setShowLogoutModal(false);
  };

  const stats = {
    conversations: 0, // This would come from API
    mediaUnlocked: 0,
    totalTimeSpent: '0h 0m'
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Profile Header */}
      <div className="bg-bg-elev-1 rounded-xl p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="flex items-center space-x-4 mb-4 sm:mb-0">
            <Avatar
              src=""
              alt={user.username}
              size="xl"
              fallback={user.username}
            />
            <div>
              <h1 className="text-2xl font-bold text-text-primary">
                {user.username}
              </h1>
              <p className="text-text-secondary">
                {user.email}
              </p>
              <div className="flex items-center mt-2 space-x-4">
                <div className="text-sm text-text-secondary">
                  Member since {new Date(user.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="secondary" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => setShowLogoutModal(true)}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-bg-elev-2 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <MessageSquare className="w-5 h-5 text-brand-400" />
            </div>
            <div className="text-2xl font-bold text-text-primary">
              {stats.conversations}
            </div>
            <div className="text-sm text-text-secondary">Conversations</div>
          </div>

          <div className="bg-bg-elev-2 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Image className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-text-primary">
              {stats.mediaUnlocked}
            </div>
            <div className="text-sm text-text-secondary">Media Unlocked</div>
          </div>

          
        </div>
      </div>


      {/* Account Information */}
      <div className="bg-bg-elev-1 rounded-xl p-6 mb-6">
        <h2 className="text-xl font-semibold text-text-primary mb-4">
          Account Information
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-gray-700">
            <span className="text-text-secondary">Email</span>
            <span className="text-text-primary">{user.email}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-700">
            <span className="text-text-secondary">Username</span>
            <span className="text-text-primary">{user.username}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-700">
            <span className="text-text-secondary">Member Since</span>
            <span className="text-text-primary">
              {new Date(user.created_at).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-text-secondary">Last Updated</span>
            <span className="text-text-primary">
              {new Date(user.updated_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Confirm Logout"
      >
        <div className="text-center">
          <p className="text-text-secondary mb-6">
            Are you sure you want to log out? You'll need to sign in again to continue chatting.
          </p>
          
          <div className="flex space-x-3">
            <Button
              variant="secondary"
              onClick={() => setShowLogoutModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="flex-1"
            >
              Logout
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProfilePage;

