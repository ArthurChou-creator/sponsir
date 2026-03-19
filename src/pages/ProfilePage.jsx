import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import Profile from '../components/profile/Profile';
import OrganizerProfile from '../components/profile/OrganizerProfile';
import SponsorProfile from '../components/profile/SponsorProfile';

const ProfilePage = () => {
  const { user, isAuthenticated, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) return null;

  const renderProfileContent = () => {
    switch (activeTab) {
      case 'profile':
        return <Profile userId={user.id} role={user.role} />;
      case 'details':
        if (user.role === 'organizer') {
          return <OrganizerProfile userId={user.id} />;
        } else if (user.role === 'sponsor') {
          return <SponsorProfile userId={user.id} />;
        }
        return (
          <div className="text-center p-8">
            <p>Profile details not available for this user type.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b">
            <h1 className="text-xl font-bold text-gray-900">My Profile</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your account information and preferences
            </p>
          </div>
          
          <div className="border-b border-gray-200">
            <div className="px-4 sm:px-6">
              <nav className="-mb-px flex space-x-6">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'profile'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Basic Information
                </button>
                <button
                  onClick={() => setActiveTab('details')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'details'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {user.role === 'organizer' ? 'Event Management' : 'Sponsorship Details'}
                </button>
              </nav>
            </div>
          </div>
          
          <div className="px-4 py-6 sm:px-6">
            {renderProfileContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;