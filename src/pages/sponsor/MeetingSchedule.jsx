import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { format, addDays, isSameDay } from "date-fns";
import { useAuth } from "../../contexts/AuthContext";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { getEventById } from "../../services/eventService";
import { scheduleMeeting, getSponsorMeetings } from "../../services/sponsorService";
import { MEETING_STATUS } from "../../utils/constants";

export default function MeetingSchedule() {
  const { currentUser, isAuthenticated, isSponsor } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const preselectedEventId = queryParams.get("eventId");

  const [meetings, setMeetings] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(preselectedEventId || "");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isScheduling, setIsScheduling] = useState(false);
  const [error, setError] = useState("");

  // Form state for new meeting
  const [meetingTitle, setMeetingTitle] = useState("");
  const [meetingDescription, setMeetingDescription] = useState("");
  const [proposedDates, setProposedDates] = useState([
    {
      date: format(addDays(new Date(), 3), "yyyy-MM-dd"),
      time: "10:00"
    },
    {
      date: format(addDays(new Date(), 4), "yyyy-MM-dd"),
      time: "14:00"
    }
  ]);

  // Redirect if not logged in or not a sponsor
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isSponsor)) {
      navigate("/login");
    }
  }, [isAuthenticated, isSponsor, navigate, isLoading]);

  // Load meetings and events
  useEffect(() => {
    async function loadData() {
      if (!currentUser) return;

      try {
        setIsLoading(true);

        // Load meetings
        const meetingsData = await getSponsorMeetings(currentUser.id);
        setMeetings(meetingsData);

        // Load unique events from meetings
        const uniqueEventIds = [...new Set(meetingsData.map(meeting => meeting.event_id))];
        
        // If there's a preselected event from URL params, add it to the list
        if (preselectedEventId && !uniqueEventIds.includes(preselectedEventId)) {
          uniqueEventIds.push(preselectedEventId);
        }

        // Fetch event details for each unique event ID
        const eventsData = await Promise.all(
          uniqueEventIds.map(async (eventId) => {
            try {
              return await getEventById(eventId);
            } catch (error) {
              console.error(`Error fetching event ${eventId}:`, error);
              return null;
            }
          })
        );

        // Filter out any null results from failed fetch attempts
        const validEvents = eventsData.filter(Boolean);
        setEvents(validEvents);

        // If there's a preselected event, load its details
        if (preselectedEventId) {
          try {
            const eventData = await getEventById(preselectedEventId);
            setSelectedEvent(eventData);
          } catch (error) {
            console.error("Error fetching preselected event:", error);
          }
        }
      } catch (error) {
        console.error("Error loading data:", error);
        setError("Failed to load meetings. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [currentUser, preselectedEventId]);

  // Load event details when selected event changes
  useEffect(() => {
    async function loadEventDetails() {
      if (!selectedEventId) {
        setSelectedEvent(null);
        return;
      }

      try {
        const eventData = await getEventById(selectedEventId);
        setSelectedEvent(eventData);
      } catch (error) {
        console.error("Error fetching event:", error);
        setError("Failed to load event details. Please try again later.");
      }
    }

    loadEventDetails();
  }, [selectedEventId]);

  // Add another date/time option
  const addProposedDate = () => {
    setProposedDates([
      ...proposedDates,
      {
        date: format(addDays(new Date(), 5), "yyyy-MM-dd"),
        time: "10:00"
      }
    ]);
  };

  // Update a proposed date
  const updateProposedDate = (index, field, value) => {
    const updatedDates = [...proposedDates];
    updatedDates[index] = {
      ...updatedDates[index],
      [field]: value
    };
    setProposedDates(updatedDates);
  };

  // Remove a proposed date
  const removeProposedDate = (index) => {
    if (proposedDates.length <= 1) {
      alert("You must provide at least one proposed time.");
      return;
    }
    
    const updatedDates = [...proposedDates];
    updatedDates.splice(index, 1);
    setProposedDates(updatedDates);
  };

  // Schedule a meeting
  const handleScheduleMeeting = async (e) => {
    e.preventDefault();
    
    if (!selectedEventId) {
      alert("Please select an event.");
      return;
    }
    
    if (!meetingTitle.trim()) {
      alert("Please enter a meeting title.");
      return;
    }
    
    try {
      setIsScheduling(true);
      
      // Convert dates and times to ISO format for API
      const formattedDates = proposedDates.map(({ date, time }) => {
        return `${date}T${time}:00`;
      });
      
      // Get organizer ID from selected event
      const organizerId = selectedEvent?.organizer_id || "2"; // Default to organizer 2 for mock data
      
      // Schedule the meeting
      await scheduleMeeting(
        currentUser.id,
        organizerId,
        selectedEventId,
        {
          title: meetingTitle,
          description: meetingDescription,
          proposed_times: formattedDates
        }
      );
      
      // Refresh meetings list
      const updatedMeetings = await getSponsorMeetings(currentUser.id);
      setMeetings(updatedMeetings);
      
      // Reset form
      setMeetingTitle("");
      setMeetingDescription("");
      setProposedDates([
        {
          date: format(addDays(new Date(), 3), "yyyy-MM-dd"),
          time: "10:00"
        },
        {
          date: format(addDays(new Date(), 4), "yyyy-MM-dd"),
          time: "14:00"
        }
      ]);
      
      alert("Meeting scheduled! The organizer will review your proposed times.");
    } catch (error) {
      console.error("Error scheduling meeting:", error);
      alert("Failed to schedule meeting. Please try again later.");
    } finally {
      setIsScheduling(false);
    }
  };

  const getMeetingStatusBadge = (status) => {
    switch (status) {
      case MEETING_STATUS.REQUESTED:
        return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">Requested</span>;
      case MEETING_STATUS.CONFIRMED:
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">Confirmed</span>;
      case MEETING_STATUS.COMPLETED:
        return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">Completed</span>;
      case MEETING_STATUS.CANCELLED:
        return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">Cancelled</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">Unknown</span>;
    }
  };

  // Group meetings by date
  const groupMeetingsByDate = () => {
    const grouped = {};

    meetings.forEach(meeting => {
      let dateKey = "Pending";
      
      if (meeting.status === MEETING_STATUS.CONFIRMED && meeting.confirmed_time) {
        const meetingDate = new Date(meeting.confirmed_time);
        dateKey = format(meetingDate, "yyyy-MM-dd");
      }
      
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      
      grouped[dateKey].push(meeting);
    });

    return grouped;
  };

  const groupedMeetings = groupMeetingsByDate();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-700"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">Meeting Schedule</h1>
        
        {error ? (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-600">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
            {/* Schedule a new meeting form */}
            <div className="lg:col-span-2">
              <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Schedule a New Meeting</h2>
                
                <form onSubmit={handleScheduleMeeting}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Event
                    </label>
                    <select
                      value={selectedEventId}
                      onChange={(e) => setSelectedEventId(e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      required
                    >
                      <option value="">-- Select an event --</option>
                      {events.map((event) => (
                        <option key={event.id} value={event.id}>
                          {event.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <Input
                    id="meeting-title"
                    label="Meeting Title"
                    value={meetingTitle}
                    onChange={(e) => setMeetingTitle(e.target.value)}
                    placeholder="e.g., Sponsorship Discussion"
                    required
                  />
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meeting Description
                    </label>
                    <textarea
                      value={meetingDescription}
                      onChange={(e) => setMeetingDescription(e.target.value)}
                      rows={3}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Describe what you'd like to discuss in this meeting"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Proposed Times
                    </label>
                    <p className="text-sm text-gray-500 mb-3">
                      Suggest multiple times that work for you. The organizer will select one.
                    </p>
                    
                    {proposedDates.map((dateTime, index) => (
                      <div key={index} className="flex space-x-2 mb-2">
                        <div className="w-1/2">
                          <input
                            type="date"
                            value={dateTime.date}
                            onChange={(e) => updateProposedDate(index, "date", e.target.value)}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            min={format(new Date(), "yyyy-MM-dd")}
                            required
                          />
                        </div>
                        <div className="w-1/3">
                          <input
                            type="time"
                            value={dateTime.time}
                            onChange={(e) => updateProposedDate(index, "time", e.target.value)}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            required
                          />
                        </div>
                        <div className="w-1/6 flex items-center">
                          <button
                            type="button"
                            onClick={() => removeProposedDate(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    <button
                      type="button"
                      onClick={addProposedDate}
                      className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Add Another Time
                    </button>
                  </div>
                  
                  <div className="mt-6">
                    <Button
                      type="submit"
                      variant="primary"
                      className="w-full"
                      disabled={isScheduling}
                    >
                      {isScheduling ? "Scheduling..." : "Request Meeting"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
            
            {/* Upcoming meetings */}
            <div>
              <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Meetings</h2>
                
                {meetings.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-gray-500">No meetings scheduled yet.</p>
                  </div>
                ) : (
                  <div>
                    {Object.keys(groupedMeetings).map((dateKey) => (
                      <div key={dateKey} className="mb-6">
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                          {dateKey === "Pending" ? "Pending Confirmation" : format(new Date(dateKey), "EEEE, MMMM d, yyyy")}
                        </h3>
                        <ul className="divide-y divide-gray-200">
                          {groupedMeetings[dateKey].map((meeting) => {
                            // Find the event this meeting is related to
                            const eventInfo = events.find(e => e.id === meeting.event_id) || { title: "Unknown Event" };
                            
                            return (
                              <li key={meeting.id} className="py-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-medium text-gray-900">{meeting.title}</p>
                                    <p className="text-sm text-gray-500">{eventInfo.title}</p>
                                    {meeting.confirmed_time && (
                                      <p className="text-sm text-gray-600 mt-1">
                                        {format(new Date(meeting.confirmed_time), "h:mm a")}
                                      </p>
                                    )}
                                  </div>
                                  <div>{getMeetingStatusBadge(meeting.status)}</div>
                                </div>
                                
                                {meeting.meeting_link && meeting.status === MEETING_STATUS.CONFIRMED && (
                                  <div className="mt-2">
                                    <a
                                      href={meeting.meeting_link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500"
                                    >
                                      <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                          fillRule="evenodd"
                                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                      Join Meeting
                                    </a>
                                  </div>
                                )}
                                
                                {meeting.status === MEETING_STATUS.REQUESTED && (
                                  <div className="mt-2 text-xs text-gray-500">
                                    Waiting for organizer to confirm a time
                                  </div>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="mt-4">
                  <Link to="/events">
                    <Button variant="outline" size="sm">
                      Browse Events
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}