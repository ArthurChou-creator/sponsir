import React, { useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import SocialLoginButtons from '../components/auth/SocialLoginButtons';
import { AuthContext } from '../contexts/AuthContext';

const LoginPage = () => {
  const { isAuthenticated, loginWithSocial } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Handle OAuth callback from URL hash
  useEffect(() => {
    const handleOAuthCallback = async () => {
      if (location.hash) {
        const params = new URLSearchParams(location.hash.substring(1));
        const provider = params.get('provider');
        const code = params.get('code');

        if (provider && code) {
          try {
            await loginWithSocial(provider, code);
            navigate('/dashboard');
          } catch (error) {
            console.error('Social login error:', error);
          }
        }
      }
    };

    handleOAuthCallback();
  }, [location, loginWithSocial, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Event Platform
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to access your account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex flex-col items-center">
          <LoginForm />
          <SocialLoginButtons />
          
          {/* Registration link */}
          <div className="mt-6">
            <p className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                Register now
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;