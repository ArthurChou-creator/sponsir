// Mock OAuth service that simulates the OAuth flow with Google and Apple

// Simulated delay to mimic network request
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock function to get OAuth URL for the specified provider
export const getOAuthUrl = (provider, redirectUrl) => {
  // In a real implementation, these would generate proper OAuth URLs
  if (provider === 'google') {
    return `https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=${encodeURIComponent(redirectUrl)}&response_type=code&client_id=mock-google-client-id&scope=email%20profile&state=${Date.now()}`;
  } else if (provider === 'apple') {
    return `https://appleid.apple.com/auth/authorize?redirect_uri=${encodeURIComponent(redirectUrl)}&response_type=code&client_id=mock-apple-client-id&scope=name%20email&state=${Date.now()}`;
  }
  
  throw new Error(`Unsupported provider: ${provider}`);
};

// Mock user profiles that would be returned from social providers
const mockSocialProfiles = {
  google: {
    providerId: 'google-12345',
    email: 'user@gmail.com',
    name: 'Google User',
    profileData: {
      picture: 'https://lh3.googleusercontent.com/mock-image',
      locale: 'en',
      given_name: 'Google',
      family_name: 'User'
    }
  },
  apple: {
    providerId: 'apple-67890',
    email: 'user@icloud.com',
    name: 'Apple User',
    profileData: {
      // Apple provides limited data, especially after first login
      is_private_email: true
    }
  }
};

// Mock function to simulate the OAuth callback handler
export const handleOAuthCallback = async (provider, code) => {
  await delay(1000); // Simulate network delay
  
  // In a real implementation, this would exchange the code for tokens with OAuth provider
  if (!code) {
    throw new Error('Authorization code is required');
  }
  
  // Get the mock profile for the specified provider
  const profile = mockSocialProfiles[provider];
  
  if (!profile) {
    throw new Error(`Unsupported provider: ${provider}`);
  }
  
  return profile;
};

// Mock function for social login
export const socialLogin = async (provider, code) => {
  try {
    await delay(1000); // Simulate network delay
    
    // Get user profile from OAuth provider (simulated)
    const socialProfile = await handleOAuthCallback(provider, code);
    
    // In a real implementation, we would look up the user by email or create a new one
    const user = {
      id: `social-${Date.now()}`,
      email: socialProfile.email,
      name: socialProfile.name,
      role: 'user', // Default role, would be set based on registration flow
      emailVerified: true, // Social logins are typically pre-verified
      socialIdentities: [{
        provider,
        providerId: socialProfile.providerId,
        email: socialProfile.email,
        profileData: socialProfile.profileData,
        linkedAt: new Date().toISOString()
      }],
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };
    
    // Generate and return a token with the user data
    return {
      user,
      token: `mock-social-auth-token-${user.id}-${Date.now()}`
    };
  } catch (error) {
    console.error(`${provider} OAuth error:`, error);
    throw new Error(`Failed to authenticate with ${provider}`);
  }
};

// Get OAuth provider configuration
export const getOAuthProviderConfig = (provider) => {
  const configs = {
    google: {
      name: 'Google',
      icon: 'google',
      backgroundColor: '#fff',
      textColor: '#757575',
      borderColor: '#ddd'
    },
    apple: {
      name: 'Apple',
      icon: 'apple',
      backgroundColor: '#000',
      textColor: '#fff',
      borderColor: '#000'
    }
  };
  
  return configs[provider] || null;
};