import { createContext, useContext, useState } from "react";
import { EVENTS } from "../data/events";

// Global events store — all pages read from here
const EventsContext = createContext(null);

export function OrganizerProvider({ children }) {
  // Start with all static events as published
  const [events, setEvents] = useState(
    EVENTS.map((e) => ({ ...e, status: "published" }))
  );

  // Organizer: add a new event
  const addEvent = (eventData) => {
    const newEvent = {
      ...eventData,
      id: `custom-${Date.now()}`,
      organizer_id: "org1",
      status: "draft",
      score: 85,
      image: eventData.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
      tags: [],
    };
    setEvents((prev) => [newEvent, ...prev]);
    return newEvent;
  };

  const publishEvent = (id) =>
    setEvents((prev) => prev.map((e) => e.id === id ? { ...e, status: "published" } : e));

  const deleteEvent = (id) =>
    setEvents((prev) => prev.filter((e) => e.id !== id));

  const getEventById = (id) => events.find((e) => e.id === id) || null;

  const addPlanToEvent = (eventId, plan) =>
    setEvents((prev) => prev.map((e) =>
      e.id === eventId
        ? { ...e, sponsorship_plans: [...(e.sponsorship_plans || []), { ...plan, id: `plan-${Date.now()}`, slotsUsed: 0 }] }
        : e
    ));

  // What sponsors see: only published
  const publishedEvents = events.filter((e) => e.status === "published");

  // All events visible to the logged-in user for management
  const myEvents = events;

  return (
    <EventsContext.Provider value={{
      events, publishedEvents, myEvents,
      addEvent, publishEvent, deleteEvent, getEventById, addPlanToEvent,
    }}>
      {children}
    </EventsContext.Provider>
  );
}

export function useOrganizer() { return useContext(EventsContext); }
export function useEvents() { return useContext(EventsContext); }
