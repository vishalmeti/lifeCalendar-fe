/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar'; // This will now correctly point to ../components/Sidebar/index.tsx
import Dashboard from '../components/Dashboard';
import Storybook from '../components/Storybook';
import AIChat from '../components/AIChat';
import AuthModal from '../components/AuthModal';
import { Button } from '../components/ui/button';
import { User, LogOut, Menu } from 'lucide-react'; // Import Menu icon
import { useIsMobile } from '@/hooks/use-mobile'; // Import useIsMobile

const Index = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState(null);
  const isMobile = useIsMobile(); // Use the hook
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile); // Sidebar open by default on desktop, closed on mobile

  // Update sidebar state when isMobile changes
  useEffect(() => {
    setIsSidebarOpen(!isMobile);
  }, [isMobile]);

  // Check for authentication token on component mount
  useEffect(() => {
    const authToken = localStorage.getItem('auth_token');
    if (authToken) {
      // If token exists, set authenticated state to true
      // You might want to validate the token with your backend here
      setIsAuthenticated(true);
      
      // Try to get user data from localStorage if available
      const userData = localStorage.getItem('user_data');
      if (userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (error) {
          console.error('Error parsing user data from localStorage:', error);
        }
      }
    }
  }, []);

  const handleLogin = (userData: any) => {
    // Save auth token and user data to localStorage
    if (userData) {
      localStorage.setItem('user_data', JSON.stringify(userData));
    }
    
    setUser(userData);
    setIsAuthenticated(true);
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    // Clear authentication data from localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    
    setUser(null);
    setIsAuthenticated(false);
    setActiveSection('dashboard');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Life Calendar</h1>
            <p className="text-lg text-gray-600">AI-Powered Personal Reflection</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-center">Welcome Back</h2>
            <p className="text-gray-600 mb-6 text-center">
              Track your daily moments, reflect on your journey, and discover insights with AI
            </p>
            
            <Button 
              onClick={() => setShowAuthModal(true)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-medium transition-colors"
            >
              Sign In / Sign Up
            </Button>
          </div>
        </div>

        {showAuthModal && (
          <AuthModal 
            onClose={() => setShowAuthModal(false)}
            onLogin={handleLogin}
          />
        )}
      </div>
    );
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'storybook':
        return <Storybook />;
      case 'chat':
        return <AIChat />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="max-h-screen bg-gray-50 flex relative"> {/* Added relative for potential overlay */}
      <Sidebar
        activeSection={activeSection}
        onSectionChange={(section) => {
          setActiveSection(section);
          if (isMobile) setIsSidebarOpen(false); // Close sidebar on section change on mobile
        }}
        user={user}
        onLogout={handleLogout}
        isOpen={isSidebarOpen} // Pass isOpen state
        onClose={() => setIsSidebarOpen(false)} // Pass onClose handler
      />

      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" // Overlay for mobile
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <main className="flex-1 h-[100vh] overflow-auto">
        {isMobile && !isSidebarOpen && ( // Button to toggle sidebar on mobile, only show if sidebar is closed
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 left-4 z-30 md:hidden" // Positioned for mobile, ensure it's under the sidebar when open
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        )}
        <div className={`p-6 h-full scroll-m-0 ${isMobile ? 'pt-16' : ''}`}> {/* Adjust padding top for mobile if menu button is present */}
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Index;
