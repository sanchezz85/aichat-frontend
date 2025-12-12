import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, User, Crown, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const navItems = [
    {
      path: '/',
      label: 'Home',
      icon: Home,
      mobileOnly: false
    },
    {
      path: '/profile',
      label: 'Profile',
      icon: User,
      mobileOnly: true
    }
  ];

  return (
    <>
      {/* Desktop Header */}
      <header className="hidden md:block bg-bg-elev-1 border-b border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">


            {/* Navigation */}
            <nav className="flex items-center space-x-6">
              {navItems.filter(item => !item.mobileOnly).map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-colors ${
                      isActive(item.path)
                        ? 'text-brand-400 bg-brand-500/10'
                        : 'text-text-secondary hover:text-text-primary hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* User Info */}
            {(user || isAuthenticated) && (
              <div className="flex items-center space-x-2">
                <Link
                  to="/profile"
                  className={`flex items-center space-x-1 px-2 py-1 text-xs rounded-md transition-colors ${
                    isActive('/profile')
                      ? 'text-brand-400 bg-brand-500/10'
                      : 'text-text-secondary hover:text-text-primary hover:bg-gray-800'
                  }`}
                >
                  <User className="w-3 h-3" />
                  <span>Profile</span>
                </Link>
           
                <a 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLogout();
                  }}
                  className="flex items-center space-x-1 px-2 py-1 text-xs text-text-secondary hover:text-text-primary hover:bg-gray-800 rounded-md transition-colors"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Logout</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-bg-elev-1 border-t border-gray-700 z-50">
        <div className="grid grid-cols-4 h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
                  active
                    ? 'text-brand-400'
                    : 'text-text-secondary active:text-text-primary'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile Header */}
      <header className="md:hidden bg-bg-elev-1 border-b border-gray-700 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 h-12">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-brand-500 rounded-lg p-0.5">
              <Crown className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-text-primary">Nova</span>
          </Link>

          {/* User Info */}
          {(user || isAuthenticated) && (
            <div className="flex items-center space-x-2">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleLogout();
                }}
                className="flex items-center justify-center p-1 text-text-secondary hover:text-text-primary hover:bg-gray-800 rounded-md transition-colors"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Navigation;

