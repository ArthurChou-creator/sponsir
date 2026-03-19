import React from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

export default function EventCard({ event }) {
  // Format date for display
  const formattedDate = event.start_time ? 
    format(new Date(event.start_time), "MMM d, yyyy") : 
    "Date to be announced";

  return (
    <div className="flex flex-col rounded-lg shadow-lg overflow-hidden h-full">
      <div className="flex-shrink-0">
        <img 
          className="h-48 w-full object-cover" 
          src={event.cover_image || "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1600&q=80"} 
          alt={event.title} 
        />
      </div>
      <div className="flex-1 bg-white p-6 flex flex-col justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-indigo-600">
            <span>{formattedDate}</span>
          </p>
          <Link to={`/events/${event.id}`} className="block mt-2">
            <p className="text-xl font-semibold text-gray-900">{event.title}</p>
            <p className="mt-3 text-base text-gray-500 line-clamp-3">
              {event.description}
            </p>
          </Link>
        </div>
        <div className="mt-6 flex items-center">
          <div className="flex-shrink-0">
            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
              {event.location?.name || "Location TBA"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}