import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const EventCard = ({ event, onDelete, onUpdate }) => {
  const [attendees, setAttendees] = useState(event.attendees.length);
  const socket = io("https://event-manager-2m60.onrender.com");

  useEffect(() => {
    // Listen for real-time attendee updates
    socket.on("attendeesUpdated", (updatedEventId) => {
      if (updatedEventId === event._id) {
        // Fetch the updated event data
        axios.get(`https://event-manager-2m60.onrender.com/api/events/${event._id}`)
          .then((res) => setAttendees(res.data.attendees.length))
          .catch((err) => console.error(err));
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [event._id]);

  return (
    <div className="border border-gray-300 p-4 rounded-lg shadow-2xl hover:shadow-lg transition-shadow bg-blue-50">
      <h3 className="text-xl font-semibold">{event.name}</h3>
      <span className="w-10 h-1 block bg-green-300 rounded my-1.5"></span>
      <p className="text-gray-600">{event.description}</p>
      <br />
      <p className="text-sm text-gray-500">
        Date: {new Date(event.date).toLocaleDateString()}
      </p>
      <p className="text-sm text-gray-500">Attendees: {attendees}</p>
      <div className="mt-4 flex space-x-2">
       
        
        <button
          onClick={() => onUpdate(event)}
          className="bg-yellow-500 border-2 border-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-transparent hover:text-yellow-500 font-bold"
        >
          Update
        </button>
        <button
          onClick={() => onDelete(event._id)}
          className="hover:bg-red-500 text-red-500 border-2 border-red-500 font-bold px-3 py-1 rounded-lg hover:text-white"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default EventCard;