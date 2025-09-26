import React from 'react';
import Navigation from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
  chatLayout?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, chatLayout = false }) => {
  if (chatLayout) {
    return (
      <div className="h-screen bg-bg flex flex-col">
        <Navigation />
        <main className="flex-1 overflow-hidden" style={{ height: 'calc(100vh - 5rem)' }}>
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <Navigation />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default Layout;

