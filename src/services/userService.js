// Mock user service for fetching and updating user profiles

// Simulated delay to mimic network request
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock profile data
const mockProfiles = {
  organizer: {
    userId: '1',
    bio: 'Experienced event organizer with over 10 years of experience',
    contactInfo: 'organizer@example.com',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    updatedAt: '2023-05-15T10:30:00Z',
    events: [
      { id: '101', name: 'Tech Conference 2023', status: 'upcoming', date: '2023-12-15' },
      { id: '102', name: 'Digital Marketing Summit', status: 'completed', date: '2023-04-10' }
    ],
    statistics: {
      totalEvents: 15,
      upcomingEvents: 3,
      averageAttendees: 250,
      totalRevenue: '$75,000'
    }
  },
  sponsor: {
    userId: '2',
    bio: 'Global technology company supporting innovative events',
    contactInfo: 'sponsor@example.com',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    updatedAt: '2023-06-20T14:45:00Z',
    companyName: 'TechGlobal Inc.',
    logo: 'https://via.placeholder.com/150x50?text=TechGlobal',
    description: 'Leading provider of technology solutions for events and conferences',
    sponsorships: [
      { id: '201', eventName: 'Tech Conference 2023', status: 'confirmed', amount: '$10,000' },
      { id: '202', eventName: 'Digital Innovation Forum', status: 'pending', amount: '$5,000' }
    ],
    analytics: {
      totalSponsored: 12,
      activeSponsorship: 3,
      totalInvestment: '$85,000',
      averageRoi: '145%'
    }
  }
};

// Get user profile based on user ID or role
export const getUserProfile = async (userId, role) => {
  await delay(800); // Simulate network delay
  
  let profile;
  
  if (role === 'organizer') {
    profile = mockProfiles.organizer;
  } else if (role === 'sponsor') {
    profile = mockProfiles.sponsor;
  } else {
    throw new Error('Invalid user role');
  }
  
  if (!profile) {
    throw new Error('Profile not found');
  }
  
  return profile;
};

// Update user profile
export const updateUserProfile = async (userId, role, profileData) => {
  await delay(1000); // Simulate network delay
  
  let profile;
  
  if (role === 'organizer') {
    profile = mockProfiles.organizer;
  } else if (role === 'sponsor') {
    profile = mockProfiles.sponsor;
  } else {
    throw new Error('Invalid user role');
  }
  
  if (!profile) {
    throw new Error('Profile not found');
  }
  
  // Update profile fields (in a real app, save to database)
  const updatedProfile = {
    ...profile,
    ...profileData,
    updatedAt: new Date().toISOString()
  };
  
  // In a real app, save to database here
  // For mock, update our mockProfiles object
  if (role === 'organizer') {
    mockProfiles.organizer = updatedProfile;
  } else if (role === 'sponsor') {
    mockProfiles.sponsor = updatedProfile;
  }
  
  return updatedProfile;
};

// Get organizer events
export const getOrganizerEvents = async (userId, status = null) => {
  await delay(600); // Simulate network delay
  
  const profile = mockProfiles.organizer;
  
  if (!profile) {
    throw new Error('Profile not found');
  }
  
  if (status) {
    return profile.events.filter(event => event.status === status);
  }
  
  return profile.events;
};

// Get sponsor sponsorships
export const getSponsorships = async (userId, status = null) => {
  await delay(600); // Simulate network delay
  
  const profile = mockProfiles.sponsor;
  
  if (!profile) {
    throw new Error('Profile not found');
  }
  
  if (status) {
    return profile.sponsorships.filter(sponsorship => sponsorship.status === status);
  }
  
  return profile.sponsorships;
};

// Get analytics data
export const getAnalytics = async (userId, role) => {
  await delay(700); // Simulate network delay
  
  if (role === 'organizer') {
    return mockProfiles.organizer.statistics;
  } else if (role === 'sponsor') {
    return mockProfiles.sponsor.analytics;
  }
  
  throw new Error('Invalid user role');
};