import React, { useState, useEffect } from 'react';
import Profile from './Profile';
import { getOrganizerEvents, getAnalytics } from '../../services/userService';

const OrganizerProfile = ({ userId }) => {
  const [events, setEvents] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch events data
        const eventsData = await getOrganizerEvents(userId);
        setEvents(eventsData);
        
        // Fetch analytics data
        const statsData = await getAnalytics(userId, 'organizer');
        setStatistics(statsData);
      } catch (error) {
        console.error('Error fetching organizer data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (userId) {
      fetchData();
    }
  }, [userId]);

  const filteredEvents = events.filter(event => {
    if (activeTab === 'all') return true;
    return event.status === activeTab;
  });

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-6">Event Management</h2>
      
      {/* Stats Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg shadow">
            <p className="text-sm text-blue-800 font-medium">Total Events</p>
            <p className="text-2xl font-bold">{statistics.totalEvents}</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg shadow">
            <p className="text-sm text-green-800 font-medium">Upcoming Events</p>
            <p className="text-2xl font-bold">{statistics.upcomingEvents}</p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg shadow">
            <p className="text-sm text-purple-800 font-medium">Average Attendees</p>
            <p className="text-2xl font-bold">{statistics.averageAttendees}</p>
          </div>
          
          <div className="bg-amber-50 p-4 rounded-lg shadow">
            <p className="text-sm text-amber-800 font-medium">Total Revenue</p>
            <p className="text-2xl font-bold">{statistics.totalRevenue}</p>
          </div>
        </div>
      )}
      
      {/* Events List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-4 py-3 border-b flex">
          <button 
            onClick={() => setActiveTab('upcoming')}
            className={`mr-4 py-2 px-4 ${activeTab === 'upcoming' ? 'text-blue-600 border-b-2 border-blue-600 font-medium' : 'text-gray-500'}`}
          >
            Upcoming
          </button>
          <button 
            onClick={() => setActiveTab('completed')}
            className={`mr-4 py-2 px-4 ${activeTab === 'completed' ? 'text-blue-600 border-b-2 border-blue-600 font-medium' : 'text-gray-500'}`}
          >
            Completed
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
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEvents.length > 0 ? (
                  filteredEvents.map((event) => (
                    <tr key={event.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{event.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{event.date}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          event.status === 'upcoming' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                      No events found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
      
      {/* Create Event Button */}
      <div className="mt-6 text-right">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow">
          Create New Event
        </button>
      </div>
    </div>
  );
};

export default OrganizerProfile;