/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import userApiService from '../lib/userApiService';
import { useToast } from '../hooks/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
  // Add other user properties as needed
}

interface AuthModalProps {
  onClose: () => void;
  onLogin: (userData: User) => void; // Use the User type
}

const AuthModal = ({ onClose, onLogin }: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{field: string, message: string}[]>([]);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // For signup, validate that passwords match
      if (!isLogin && password !== confirmPassword) {
        toast({
          title: "Passwords don't match",
          description: "Please make sure your passwords match.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      let response;
      let user;
      if (isLogin) {
        response = await userApiService.login(email, password);
        user = await userApiService.getCurrentUser();
      } else {
        response = await userApiService.register(name, email, password, confirmPassword);
        user = await userApiService.getCurrentUser();
      }
            
      // Pass the user data to the parent component
      
      if (response.status === 200){
        onLogin(user.data);
        toast({
          title: isLogin ? "Signed in successfully!" : "Account created successfully!",
          description: `Welcome back !`,
          variant: "success",
        });
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      toast({
        title: "Authentication failed",
        description: error.response?.data?.msg || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to validate form when inputs change
  useEffect(() => {
    if (!isLogin) {
      validateForm();
    }
  }, [isLogin, email, password, confirmPassword, name]);

  // Separate validation function to check inputs and set errors
  const validateForm = () => {
    const errors: {field: string, message: string}[] = [];
      
    // Name validation (contains only letters and numbers)
    if (name.trim() !== '' && !/^[a-zA-Z0-9]+$/.test(name.trim())) {
      errors.push({ field: 'username', message: 'Username must contain only letters and numbers' });
    }
    
    // Password validations
    if (password.trim() !== '' && password.length < 6) {
      errors.push({ field: 'password', message: 'Password must be at least 6 characters long' });
    }
    
    if (password.trim() !== '' && !/\d/.test(password)) {
      errors.push({ field: 'password', message: 'Password must contain at least one number' });
    }
    
    // Confirm password validation
    if (confirmPassword.trim() !== '' && password !== confirmPassword) {
      errors.push({ field: 'confirmpassword', message: 'Passwords do not match' });
    }
    
    // Update validation errors state
    setValidationErrors(errors);
  };

  // Check if form is valid without setting state
  const isFormValid = () => {
    if (isLogin) {
      return email.trim() !== '' && password.trim() !== '';
    } else {
      return (
        email.trim() !== '' && 
        password.trim() !== '' && 
        confirmPassword.trim() !== '' && 
        name.trim() !== '' && 
        validationErrors.length === 0 &&
        /^[a-zA-Z0-9]+$/.test(name.trim()) &&
        password.length >= 6 &&
        /\d/.test(password) &&
        password === confirmPassword
      );
    }
  };

  // Helper function to get field-specific error messages
  const getFieldErrors = (fieldName: string) => {
    return validationErrors
      .filter(error => error.field === fieldName)
      .map(error => error.message);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                User Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                  required={!isLogin}
                />
              </div>
              {!isLogin && getFieldErrors('username').map((error, index) => (
                <p key={index} className="text-red-500 text-sm mt-1">{error}</p>
              ))}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10"
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {!isLogin && getFieldErrors('password').map((error, index) => (
              <p key={index} className="text-red-500 text-sm mt-1">{error}</p>
            ))}
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required={!isLogin}
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {!isLogin && getFieldErrors('confirmpassword').map((error, index) => (
                <p key={index} className="text-red-500 text-sm mt-1">{error}</p>
              ))}
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading || !isFormValid()}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setConfirmPassword(''); // Clear confirm password when toggling
                setValidationErrors([]); // Clear validation errors when toggling
              }}
              className="text-indigo-600 hover:text-indigo-700 text-sm"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
