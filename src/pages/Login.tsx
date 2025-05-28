import React, { useState } from 'react'; // Import useState
import AuthModal from '../components/AuthModal';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button'; // Import Button

// Define a basic User type, adjust as needed
interface User {
  id: string;
  name: string;
  email: string;
  // Add other user properties as needed
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false); // State to control modal visibility

  const handleLogin = (userData: User) => {
    // Store a more generic token or session ID instead of full user data
    localStorage.setItem('session_token', userData.id); // Example: store user ID as session token
    navigate('/');
  };

  const openAuthModal = () => {
    setShowAuthModal(true);
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center p-6 text-center overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-60 h-60 bg-pink-500 rounded-full opacity-10 animate-pulse delay-2000"></div>
      </div>

      {!showAuthModal && (
        <div className="relative z-10 max-w-lg w-full backdrop-blur-md bg-white/10 rounded-3xl shadow-2xl p-8 md:p-12">
          <div className="mb-10">
            <h1 className="text-6xl font-bold text-white mb-4 tracking-tight">Life Calendar</h1>
            <p className="text-2xl text-slate-300">
              Reflect on your past, understand your present, and shape your future.
            </p>
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-white">Welcome!</h2>
            <p className="text-slate-300 text-lg">
              Join us to track your daily moments, reflect on your journey, and discover insights with AI.
            </p>
            <Button
              onClick={openAuthModal}
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-indigo-500/50 transition-all duration-300 ease-in-out transform hover:scale-105"
              size="lg"
            >
              Sign In / Sign Up
            </Button>
          </div>
          <p className="text-sm text-slate-400 mt-10">
            Your personal AI-powered reflection companion.
          </p>
        </div>
      )}

      {showAuthModal && (
        <AuthModal
          onClose={closeAuthModal} // Use the new closeAuthModal handler
          onLogin={handleLogin}
        />
      )}
    </div>
  );
};

export default LoginPage;
