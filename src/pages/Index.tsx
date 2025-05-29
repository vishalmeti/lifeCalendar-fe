import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Dashboard from '../components/Dashboard';
import Storybook from '../components/Storybook';
import AIChat from '../components/AIChat';
import Calendar from '../components/Calendar';
import { Button } from '../components/ui/button';
import { User, LogOut, Menu } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Index = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);
  const navigate = useNavigate(); // Initialize useNavigate

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
    } else {
      navigate('/login'); // Redirect to /login if not authenticated
    }
  }, [navigate]); // Add navigate to dependency array

  const handleLogout = () => {
    // Clear authentication data from localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    
    setUser(null);
    setIsAuthenticated(false);
    setActiveSection('dashboard');
    navigate('/login'); // Redirect to /login on logout
  };

  if (!isAuthenticated) {
    // This part will likely not be reached due to the redirect,
    // but it's good practice to have a fallback or loading state.
    // Alternatively, you can return null or a loading spinner.
    return null; // Or a loading indicator
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'calendar':
        return <Calendar />;
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
