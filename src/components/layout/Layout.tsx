import React from 'react';
import Navigation from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-bg">
      <Navigation />
      <main className="pt-16 md:pt-20 pb-20 md:pb-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;

