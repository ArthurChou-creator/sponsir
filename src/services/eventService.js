import { API_BASE_URL, EVENT_STATUS } from "../utils/constants";

// Mock events data for development
const MOCK_EVENTS = [
  {
    id: "1",
    title: "Tech Innovation Summit 2025",
    description: "Join industry leaders to explore cutting-edge technologies and innovations that are shaping our future. Connect with visionaries, entrepreneurs, and researchers who are at the forefront of technological advancement.",
    start_time: "2025-06-15T09:00:00Z",
    end_time: "2025-06-17T17:00:00Z",
    location: {
      name: "San Francisco Convention Center",
      address: "123 Tech Blvd, San Francisco, CA 94101",
      latitude: 37.7749,
      longitude: -122.4194
    },
    organizer_id: "2",
    sponsor_ids: [],
    status: EVENT_STATUS.PUBLISHED,
    cover_image: "/images/tech-summit.jpg",
    deck_url: "/decks/tech-summit-deck.pdf",
    sponsorship_plans: [
      {
        id: "101",
        event_id: "1",
        title: "Bronze Sponsor",
        price: 1500,
        description: "Basic visibility at the event with your logo on our website and event materials.",
        benefits: ["Logo on event website", "Logo on event materials", "1 free ticket"],
      },
      {
        id: "102",
        event_id: "1",
        title: "Silver Sponsor",
        price: 3000,
        description: "Enhanced visibility with a small booth and logo placement on prominent locations.",
        benefits: ["Everything in Bronze", "Small exhibition booth", "2 free tickets", "Social media mentions"],
      },
      {
        id: "103",
        event_id: "1",
        title: "Gold Sponsor",
        price: 7500,
        description: "Premium visibility with a large booth, speaking opportunity, and prominent branding.",
        benefits: ["Everything in Silver", "Large exhibition booth", "5 free tickets", "Speaking opportunity", "Prominent logo placement"],
      },
    ]
  },
  {
    id: "2",
    title: "Global Marketing Conference",
    description: "Connect with marketing professionals and discover the latest trends in digital marketing, brand strategy, and customer engagement. Learn from industry experts about what's working now.",
    start_time: "2025-07-22T10:00:00Z",
    end_time: "2025-07-24T16:00:00Z",
    location: {
      name: "New York Marriott Marquis",
      address: "1535 Broadway, New York, NY 10036",
      latitude: 40.7589,
      longitude: -73.9851
    },
    organizer_id: "2",
    sponsor_ids: ["1"],
    status: EVENT_STATUS.PUBLISHED,
    cover_image: "/images/marketing-conf.jpg",
    deck_url: "/decks/marketing-conf-deck.pdf",
    sponsorship_plans: [
      {
        id: "201",
        event_id: "2",
        title: "Basic Sponsor",
        price: 2000,
        description: "Basic branding package with logo placement on event materials.",
        benefits: ["Logo on event website", "Logo on event materials", "2 free tickets"],
      },
      {
        id: "202",
        event_id: "2",
        title: "Premium Sponsor",
        price: 5000,
        description: "Enhanced visibility with booth space and speaking opportunity.",
        benefits: ["Everything in Basic", "Exhibition booth", "5 free tickets", "30-min speaking slot"],
      },
    ]
  },
  {
    id: "3",
    title: "Sustainable Business Forum",
    description: "Learn how businesses are implementing sustainable practices for a better future. Explore strategies for reducing environmental impact while driving business growth.",
    start_time: "2025-08-10T09:30:00Z",
    end_time: "2025-08-11T17:30:00Z",
    location: {
      name: "Seattle Convention Center",
      address: "705 Pike St, Seattle, WA 98101",
      latitude: 47.6114,
      longitude: -122.3322
    },
    organizer_id: "2",
    sponsor_ids: [],
    status: EVENT_STATUS.PUBLISHED,
    cover_image: "/images/sustainability-forum.jpg",
    deck_url: "/decks/sustainability-forum-deck.pdf",
    sponsorship_plans: [
      {
        id: "301",
        event_id: "3",
        title: "Green Supporter",
        price: 1000,
        description: "Support sustainable business practices with basic recognition at the event.",
        benefits: ["Logo on event website", "Recognition during opening ceremony", "1 free ticket"],
      },
      {
        id: "302",
        event_id: "3",
        title: "Sustainability Partner",
        price: 3500,
        description: "Demonstrate your commitment to sustainability with enhanced visibility.",
        benefits: ["Everything in Green Supporter", "Exhibition booth", "3 free tickets", "Panel participation"],
      },
      {
        id: "303",
        event_id: "3",
        title: "Eco Champion",
        price: 8000,
        description: "Position your brand as a leader in sustainability with premium exposure.",
        benefits: ["Everything in Sustainability Partner", "Keynote speaking opportunity", "Sponsored workshop", "6 free tickets", "Featured case study"],
      },
    ]
  }
];

// Helper function to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Get all events (with optional filters)
export const getAllEvents = async (filters = {}) => {
  try {
    // Simulate API call
    await delay(500);
    
    let filteredEvents = [...MOCK_EVENTS];
    
    // Apply filters
    if (filters.title) {
      filteredEvents = filteredEvents.filter(event => 
        event.title.toLowerCase().includes(filters.title.toLowerCase())
      );
    }
    
    if (filters.status) {
      filteredEvents = filteredEvents.filter(event => 
        event.status === filters.status
      );
    }
    
    if (filters.organizerId) {
      filteredEvents = filteredEvents.filter(event => 
        event.organizer_id === filters.organizerId
      );
    }
    
    return filteredEvents;
  } catch (error) {
    console.error("Error getting events:", error);
    throw error;
  }
};

// Get event by ID
export const getEventById = async (eventId) => {
  try {
    // Simulate API call
    await delay(300);
    
    const event = MOCK_EVENTS.find(e => e.id === eventId);
    
    if (!event) {
      throw new Error("Event not found");
    }
    
    return event;
  } catch (error) {
    console.error(`Error getting event with ID ${eventId}:`, error);
    throw error;
  }
};

// Create new event
export const createEvent = async (eventData) => {
  try {
    // Simulate API call
    await delay(800);
    
    // Generate new ID
    const newId = String(parseInt(MOCK_EVENTS[MOCK_EVENTS.length - 1].id) + 1);
    
    // Create new event object
    const newEvent = {
      id: newId,
      ...eventData,
      sponsor_ids: [],
      status: EVENT_STATUS.DRAFT,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      sponsorship_plans: []
    };
    
    // Add to mock data
    MOCK_EVENTS.push(newEvent);
    
    return newEvent;
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
};

// Update event
export const updateEvent = async (eventId, eventData) => {
  try {
    // Simulate API call
    await delay(600);
    
    // Find event index
    const eventIndex = MOCK_EVENTS.findIndex(e => e.id === eventId);
    
    if (eventIndex === -1) {
      throw new Error("Event not found");
    }
    
    // Update event
    const updatedEvent = {
      ...MOCK_EVENTS[eventIndex],
      ...eventData,
      updated_at: new Date().toISOString()
    };
    
    // Replace in mock data
    MOCK_EVENTS[eventIndex] = updatedEvent;
    
    return updatedEvent;
  } catch (error) {
    console.error(`Error updating event with ID ${eventId}:`, error);
    throw error;
  }
};

// Delete event
export const deleteEvent = async (eventId) => {
  try {
    // Simulate API call
    await delay(400);
    
    // Find event index
    const eventIndex = MOCK_EVENTS.findIndex(e => e.id === eventId);
    
    if (eventIndex === -1) {
      throw new Error("Event not found");
    }
    
    // Remove from mock data
    MOCK_EVENTS.splice(eventIndex, 1);
    
    return true;
  } catch (error) {
    console.error(`Error deleting event with ID ${eventId}:`, error);
    throw error;
  }
};

// Get sponsorship plans for an event
export const getSponsorshipPlans = async (eventId) => {
  try {
    // Simulate API call
    await delay(300);
    
    const event = MOCK_EVENTS.find(e => e.id === eventId);
    
    if (!event) {
      throw new Error("Event not found");
    }
    
    return event.sponsorship_plans || [];
  } catch (error) {
    console.error(`Error getting sponsorship plans for event ID ${eventId}:`, error);
    throw error;
  }
};

// Create sponsorship plan for an event
export const createSponsorshipPlan = async (eventId, planData) => {
  try {
    // Simulate API call
    await delay(500);
    
    // Find event
    const eventIndex = MOCK_EVENTS.findIndex(e => e.id === eventId);
    
    if (eventIndex === -1) {
      throw new Error("Event not found");
    }
    
    // Generate new plan ID
    const newPlanId = `${eventId}${Date.now()}`;
    
    // Create new plan
    const newPlan = {
      id: newPlanId,
      event_id: eventId,
      ...planData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Add plan to event
    if (!MOCK_EVENTS[eventIndex].sponsorship_plans) {
      MOCK_EVENTS[eventIndex].sponsorship_plans = [];
    }
    
    MOCK_EVENTS[eventIndex].sponsorship_plans.push(newPlan);
    
    return newPlan;
  } catch (error) {
    console.error(`Error creating sponsorship plan for event ID ${eventId}:`, error);
    throw error;
  }
};

// Upload event cover image (mock)
export const uploadEventCover = async (eventId, file) => {
  try {
    // Simulate API call with longer delay to mimic file upload
    await delay(1500);
    
    // In a real app, this would handle file upload to a server or cloud storage
    // For this mock, we just return a success response with a fake URL
    
    return {
      success: true,
      url: `/images/events/${eventId}-cover-${Date.now()}.jpg`
    };
  } catch (error) {
    console.error(`Error uploading cover for event ID ${eventId}:`, error);
    throw error;
  }
};

// Upload event deck (mock)
export const uploadEventDeck = async (eventId, file) => {
  try {
    // Simulate API call with longer delay to mimic file upload
    await delay(2000);
    
    // In a real app, this would handle file upload to a server or cloud storage
    // For this mock, we just return a success response with a fake URL
    
    return {
      success: true,
      url: `/decks/events/${eventId}-deck-${Date.now()}.pdf`
    };
  } catch (error) {
    console.error(`Error uploading deck for event ID ${eventId}:`, error);
    throw error;
  }
};

// Get events for the current organizer
export const getOrganizerEvents = async (organizerId) => {
  try {
    // Simulate API call
    await delay(500);
    
    const events = MOCK_EVENTS.filter(e => e.organizer_id === organizerId);
    
    return events;
  } catch (error) {
    console.error(`Error getting events for organizer ID ${organizerId}:`, error);
    throw error;
  }
};

// Publish event (change status from DRAFT to PUBLISHED)
export const publishEvent = async (eventId) => {
  try {
    // Simulate API call
    await delay(400);
    
    // Find event index
    const eventIndex = MOCK_EVENTS.findIndex(e => e.id === eventId);
    
    if (eventIndex === -1) {
      throw new Error("Event not found");
    }
    
    // Update event status
    MOCK_EVENTS[eventIndex].status = EVENT_STATUS.PUBLISHED;
    MOCK_EVENTS[eventIndex].updated_at = new Date().toISOString();
    
    return MOCK_EVENTS[eventIndex];
  } catch (error) {
    console.error(`Error publishing event with ID ${eventId}:`, error);
    throw error;
  }
};