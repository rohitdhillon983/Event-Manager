import React from "react";
import EventCard from "./EventCard";

const EventList = ({ events, onDelete, onUpdate }) => {
  // Ensure events is an array before calling map
  if (!Array.isArray(events)) {
    console.error("Expected events to be an array, but got:", events);
    return <p className="text-red-500">No events found or invalid data format.</p>;
  }

  return (
    <div className="p-4 border-t-4 border-gray-300 ">
      <h2 className="text-4xl font-bold mb-4 text-rose-600">My Events</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((event) => (
          <EventCard
            key={event._id}
            event={event}
            onDelete={onDelete}
            onUpdate={onUpdate}
          />
        ))}
      </div>
    </div>
  );
};

export default EventList;