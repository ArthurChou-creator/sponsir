import React from 'react';
import { getOAuthUrl } from '../../services/oauthService';

const SocialLoginButtons = () => {
  // Function to handle social login button clicks
  const handleSocialLogin = (provider) => {
    // In a real implementation, this would be a more complex flow
    // For now, we'll just open the OAuth URL in a new window
    const redirectUrl = `${window.location.origin}/auth/callback/${provider}`;
    const authUrl = getOAuthUrl(provider, redirectUrl);
    
    // For this demo, we'll simulate the entire OAuth flow by directly setting the URL hash
    // In a real application, we would open the OAuth popup window
    window.location.hash = `#provider=${provider}&code=demo_auth_code`;
    
    console.log(`Redirecting to ${provider} authentication...`);
  };

  return (
    <div className="w-full max-w-md">
      <div className="mt-2 mb-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">or continue with</span>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col space-y-3">
        <button
          onClick={() => handleSocialLogin('google')}
          type="button"
          className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
          </svg>
          Sign in with Google
        </button>
        
        <button
          onClick={() => handleSocialLogin('apple')}
          type="button"
          className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16.125 20.1255c-.982.112-1.3.225-2.175.225-1.125 0-2.09-.263-2.9-.788-.8-.525-1.434-1.275-1.9-2.25-.466-.975-.7-2.15-.7-3.525s.234-2.55.7-3.525c.466-.975 1.1-1.725 1.9-2.25.81-.525 1.775-.788 2.9-.788.875 0 1.675.113 2.4.338a11.399 11.399 0 0 1 1.688.675l-.525 1.275c-.359-.192-.81-.375-1.35-.548A5.961 5.961 0 0 0 14.05 8.7c-1.684 0-2.992.484-3.925 1.451-.933.968-1.4 2.337-1.4 4.099 0 1.771.467 3.14 1.4 4.108.933.968 2.241 1.451 3.925 1.451.8 0 1.5-.102 2.1-.305.6-.204 1.125-.497 1.575-.881l.638 1.2a6.898 6.898 0 0 1-2.238 1.302zm-6.15-16.5c.35 0 .65.117.9.35.25.233.375.517.375.85s-.125.617-.375.85c-.25.233-.55.35-.9.35s-.65-.117-.9-.35c-.25-.233-.375-.517-.375-.85s.125-.617.375-.85c.25-.233.55-.35.9-.35zm1.35.875c0-.175-.06-.325-.175-.45a.598.598 0 0 0-.45-.175.598.598 0 0 0-.45.175.598.598 0 0 0-.175.45c0 .175.058.325.175.45s.267.188.45.188.333-.062.45-.188a.598.598 0 0 0 .175-.45z" />
          </svg>
          Sign in with Apple
        </button>
      </div>
    </div>
  );
};

export default SocialLoginButtons;