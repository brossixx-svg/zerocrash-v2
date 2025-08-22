import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AuthCard from './components/AuthCard';
import AuthFooter from './components/AuthFooter';
import AuthBackground from './components/AuthBackground';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';

const AuthenticationPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { user, signIn, signUp, signInWithGoogle, signInWithLinkedIn, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !authLoading) {
      const from = location?.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [user, authLoading, navigate, location]);

  const handleInputChange = (e) => {
    const { name, value } = e?.target || {};
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
  };

  const validateForm = () => {
    if (!formData?.email?.trim()) {
      setError('Email is required');
      return false;
    }

    if (!formData?.password?.trim()) {
      setError('Password is required');
      return false;
    }

    if (formData?.password?.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }

    if (isSignUp) {
      if (!formData?.fullName?.trim()) {
        setError('Full name is required');
        return false;
      }

      if (formData?.password !== formData?.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isSignUp) {
        const { data, error } = await signUp(
          formData?.email?.trim(),
          formData?.password,
          { full_name: formData?.fullName?.trim() }
        );

        if (error) {
          throw error;
        }

        setSuccess('Account created successfully! Please check your email to verify your account.');
        // Reset form
        setFormData({
          email: '',
          password: '',
          fullName: '',
          confirmPassword: ''
        });
      } else {
        const { data, error } = await signIn(
          formData?.email?.trim(),
          formData?.password
        );

        if (error) {
          throw error;
        }

        // Navigation will be handled by useEffect when user state updates
      }
    } catch (error) {
      console.error('Authentication error:', error);
      
      // Handle specific error messages
      if (error?.message?.includes('Invalid login credentials')) {
        setError('Invalid email or password. Please try again.');
      } else if (error?.message?.includes('User already registered')) {
        setError('An account with this email already exists. Please sign in instead.');
      } else if (error?.message?.includes('Email not confirmed')) {
        setError('Please check your email and click the verification link before signing in.');
      } else if (error?.message?.includes('Failed to fetch')) {
        setError('Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.');
      } else {
        setError(error?.message || 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider) => {
    setError('');
    setLoading(true);

    try {
      let result;
      if (provider === 'google') {
        result = await signInWithGoogle();
      } else if (provider === 'linkedin') {
        result = await signInWithLinkedIn();
      }

      if (result?.error) {
        throw result?.error;
      }
    } catch (error) {
      console.error(`${provider} OAuth error:`, error);
      
      if (error?.message?.includes('Failed to fetch')) {
        setError('Cannot connect to authentication service. Your Supabase project may be paused or inactive.');
      } else {
        setError(`Failed to sign in with ${provider}. Please try again.`);
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setSuccess('');
    setFormData({
      email: '',
      password: '',
      fullName: '',
      confirmPassword: ''
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 relative overflow-hidden">
      <AuthBackground />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Logo and Title */}
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-primary rounded-2xl p-4">
                <Icon name="Search" size={32} className="text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Welcome to ZeroCrash
            </h1>
            <p className="text-text-secondary">
              {isSignUp ? 'Create your account to get started' : 'Sign in to your account'}
            </p>
          </div>

          <AuthCard>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name (Sign Up only) */}
              {isSignUp && (
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-text-primary mb-2">
                    Full Name
                  </label>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData?.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    disabled={loading}
                    className="w-full"
                  />
                </div>
              )}

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData?.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  disabled={loading}
                  className="w-full"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-2">
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData?.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  disabled={loading}
                  className="w-full"
                />
              </div>

              {/* Confirm Password (Sign Up only) */}
              {isSignUp && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-primary mb-2">
                    Confirm Password
                  </label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData?.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    disabled={loading}
                    className="w-full"
                  />
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-error-50 border border-error-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <Icon name="AlertTriangle" size={16} className="text-error mt-0.5 mr-2 flex-shrink-0" />
                    <p className="text-error text-sm">{error}</p>
                  </div>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="bg-success-50 border border-success-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <Icon name="CheckCircle" size={16} className="text-success mt-0.5 mr-2 flex-shrink-0" />
                    <p className="text-success text-sm">{success}</p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                variant="default"
                size="lg"
                disabled={loading}
                className="w-full"
                iconName={loading ? "Loader" : (isSignUp ? "UserPlus" : "LogIn")}
                iconPosition="left"
              >
                {loading 
                  ? (isSignUp ? 'Creating Account...' : 'Signing In...') 
                  : (isSignUp ? 'Create Account' : 'Sign In')
                }
              </Button>

              {/* OAuth Buttons */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleOAuthSignIn('google')}
                  disabled={loading}
                  className="w-full"
                  iconName="Chrome"
                  iconPosition="left"
                >
                  Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleOAuthSignIn('linkedin')}
                  disabled={loading}
                  className="w-full"
                  iconName="Linkedin"
                  iconPosition="left"
                >
                  LinkedIn
                </Button>
              </div>

              {/* Toggle Mode */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={toggleMode}
                  disabled={loading}
                  className="text-primary hover:text-primary-dark text-sm font-medium disabled:opacity-50"
                >
                  {isSignUp 
                    ? 'Already have an account? Sign in' : "Don't have an account? Sign up"
                  }
                </button>
              </div>
            </form>
          </AuthCard>

          <AuthFooter />
        </div>
      </div>
    </div>
  );
};

export default AuthenticationPage;