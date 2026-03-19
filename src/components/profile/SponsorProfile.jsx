import React, { useState, useEffect } from 'react';
import Profile from './Profile';
import { getSponsorships, getAnalytics } from '../../services/userService';

const SponsorProfile = ({ userId }) => {
  const [sponsorships, setSponsorships] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [activeTab, setActiveTab] = useState('confirmed');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch sponsorships data
        const sponsorshipsData = await getSponsorships(userId);
        setSponsorships(sponsorshipsData);
        
        // Fetch analytics data
        const analyticsData = await getAnalytics(userId, 'sponsor');
        setAnalytics(analyticsData);
      } catch (error) {
        console.error('Error fetching sponsor data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (userId) {
      fetchData();
    }
  }, [userId]);

  const filteredSponsorships = sponsorships.filter(sponsorship => {
    if (activeTab === 'all') return true;
    return sponsorship.status === activeTab;
  });

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-6">Sponsorship Dashboard</h2>
      
      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg shadow">
            <p className="text-sm text-blue-800 font-medium">Total Sponsored</p>
            <p className="text-2xl font-bold">{analytics.totalSponsored}</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg shadow">
            <p className="text-sm text-green-800 font-medium">Active Sponsorships</p>
            <p className="text-2xl font-bold">{analytics.activeSponsorship}</p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg shadow">
            <p className="text-sm text-purple-800 font-medium">Total Investment</p>
            <p className="text-2xl font-bold">{analytics.totalInvestment}</p>
          </div>
          
          <div className="bg-amber-50 p-4 rounded-lg shadow">
            <p className="text-sm text-amber-800 font-medium">Average ROI</p>
            <p className="text-2xl font-bold">{analytics.averageRoi}</p>
          </div>
        </div>
      )}
      
      {/* Company Information */}
      <div className="bg-white rounded-lg shadow-md p-5 mb-6">
        <h3 className="font-bold text-lg mb-3">Company Profile</h3>
        
        <div className="flex flex-col md:flex-row items-start">
          <div className="w-40 mb-4 md:mb-0 md:mr-6">
            <img 
              src={analytics?.logo || 'https://via.placeholder.com/150x50?text=Logo'} 
              alt="Company Logo" 
              className="w-full h-auto border border-gray-200 rounded"
            />
          </div>
          
          <div className="flex-1">
            <h4 className="text-xl font-medium">{analytics?.companyName || 'Company Name'}</h4>
            <p className="text-gray-600 mt-2">{analytics?.description || 'Company description'}</p>
          </div>
        </div>
      </div>
      
      {/* Sponsorships List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-4 py-3 border-b flex">
          <button 
            onClick={() => setActiveTab('confirmed')}
            className={`mr-4 py-2 px-4 ${activeTab === 'confirmed' ? 'text-blue-600 border-b-2 border-blue-600 font-medium' : 'text-gray-500'}`}
          >
            Confirmed
          </button>
          <button 
            onClick={() => setActiveTab('pending')}
            className={`mr-4 py-2 px-4 ${activeTab === 'pending' ? 'text-blue-600 border-b-2 border-blue-600 font-medium' : 'text-gray-500'}`}
          >
            Pending
          </button>
          <button 
            onClick={() => setActiveTab('all')}
            className={`py-2 px-4 ${activeTab === 'all' ? 'text-blue-600 border-b-2 border-blue-600 font-medium' : 'text-gray-500'}`}
          >
            All
          </button>
        </div>
        
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSponsorships.length > 0 ? (
                  filteredSponsorships.map((sponsorship) => (
                    <tr key={sponsorship.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{sponsorship.eventName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{sponsorship.amount}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          sponsorship.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {sponsorship.status.charAt(0).toUpperCase() + sponsorship.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                      No sponsorships found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
      
      {/* Find Events Button */}
      <div className="mt-6 text-right">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow">
          Find Events to Sponsor
        </button>
      </div>
    </div>
  );
};

export default SponsorProfile;