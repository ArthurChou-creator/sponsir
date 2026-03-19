import React, { useState, useEffect } from 'react';
import { getUserProfile } from '../../services/userService';

const Profile = ({ userId, role }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const profileData = await getUserProfile(userId, role);
        setProfile(profileData);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    if (userId && role) {
      fetchProfile();
    }
  }, [userId, role]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
        <p>{error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center p-4">
        <p>No profile information available.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <div className="flex flex-col md:flex-row items-center md:items-start">
        <div className="w-32 h-32 mb-4 md:mb-0 md:mr-6">
          <img 
            src={profile.avatar} 
            alt="Profile" 
            className="rounded-full w-full h-full object-cover border-4 border-gray-100 shadow"
          />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold">{profile.name || 'User'}</h2>
          <p className="text-gray-600 mb-2">{role.charAt(0).toUpperCase() + role.slice(1)}</p>
          <p className="text-gray-700 mb-4">{profile.bio}</p>
          
          <div className="border-t pt-4 mt-2">
            <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
            <p className="text-gray-700">{profile.contactInfo}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-8 border-t pt-6">
        <p className="text-sm text-gray-500">Last updated: {new Date(profile.updatedAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default Profile;