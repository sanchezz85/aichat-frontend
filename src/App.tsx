import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HomePage, PersonasPage, ChatPage, ProfilePage } from './pages';
import ChatLayoutPage from './pages/ChatLayoutPage';
import { Layout } from './components/layout';
import { useAuth } from './hooks/useAuth';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-bg text-text-primary">
          <Routes>
            {/* Home route (includes auth forms when not logged in) */}
            <Route path="/" element={<HomePage />} />
            
            {/* Protected routes */}
            <Route
              path="/personas"
              element={
                <ProtectedRoute>
                  <Layout>
                    <PersonasPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/personas/:personaId"
              element={
                <ProtectedRoute>
                  <Layout>
                    <PersonasPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/personas/:personaId/:tab"
              element={
                <ProtectedRoute>
                  <Layout>
                    <PersonasPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <ChatLayoutPage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/chat/:conversationId"
              element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ProfilePage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            {/* Catch all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
};

export default App;

