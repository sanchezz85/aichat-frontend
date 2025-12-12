import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { Button, Modal } from '../components/ui';
import { useAuth } from '../hooks/useAuth';

const ProfilePage: React.FC = () => {
  const { user, isAuthenticated, logout, deleteAccount } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Redirect to home if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  const handleLogout = () => {
    logout();
    setShowLogoutModal(false);
  };

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      await deleteAccount();
      // No need to navigate or close modal - the user will be redirected automatically
      // because they're no longer authenticated
    } catch (error) {
      console.error('Failed to delete account:', error);
      alert('Failed to delete account. Please try again.');
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Account Information */}
      <div className="bg-bg-elev-1 rounded-xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-800/50">
          <h2 className="text-lg font-semibold text-text-primary">
            Account Information
          </h2>
        </div>
        
        {/* Content */}
        <div className="px-6 py-6">
          <div className="space-y-5">
            {/* Email */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Email
                </label>
                <p className="text-text-primary mt-1.5">
                  {user.email}
                </p>
              </div>
            </div>

            {/* Username */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Username
                </label>
                <p className="text-text-primary mt-1.5">
                  {user.username}
                </p>
              </div>
            </div>

            {/* Member Since & Last Updated in a row */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Member Since
                </label>
                <p className="text-text-primary mt-1.5">
                  {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Last Updated
                </label>
                <p className="text-text-primary mt-1.5">
                  {user.updated_at ? new Date(user.updated_at).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="px-6 py-4 border-t border-gray-800/50">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-medium text-text-primary">
                Delete Account
              </h3>
              <p className="text-xs text-text-secondary mt-0.5">
                Permanently delete your account and all associated data
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm shrink-0"
            >
              <Trash2 size={16} />
              Delete
            </Button>
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

      {/* Delete Account Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => !isDeleting && setShowDeleteModal(false)}
        title="Delete Account"
      >
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="bg-red-500/10 p-3 rounded-full">
              <Trash2 size={32} className="text-red-500" />
            </div>
          </div>
          
          <p className="text-text-primary font-semibold mb-2">
            This action cannot be undone
          </p>
          
          <p className="text-text-secondary mb-6">
            Deleting your account will permanently remove all your data, including:
          </p>
          
          <ul className="text-text-secondary text-left mb-6 space-y-2 bg-bg-elev-1 p-4 rounded-lg">
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-1">•</span>
              <span>All your conversations and chat history</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-1">•</span>
              <span>All messages sent and received</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-1">•</span>
              <span>Your follow requests and connections</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-1">•</span>
              <span>Your account information and profile</span>
            </li>
          </ul>
          
          <p className="text-text-secondary mb-6 text-sm italic">
            Are you absolutely sure you want to delete your account?
          </p>
          
          <div className="flex space-x-3">
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
              className="flex-1"
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              className="flex-1"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Yes, Delete My Account'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProfilePage;

