import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { MdOutlineEventNote } from "react-icons/md";

const Home = () => {
  const [events, setEvents] = useState([]);
  const [userId, setUserId] = useState(null);
  const socket = io("https://event-manager-2m60.onrender.com");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterCreater, setFilterCreater] = useState("");

  useEffect(() => {
    fetchEvents();
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    // Apply search and filter whenever events, searchQuery, filterDate, or filterCreater changes
    applyFilters();
  }, [events, searchQuery, filterDate, filterCreater]);

  const fetchEvents = async () => {
    try {
      const res = await axios.get("https://event-manager-2m60.onrender.com/api/events/all");
      setEvents(res.data);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const res = await axios.get("https://event-manager-2m60.onrender.com/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserId(res.data.userId);
      }
    } catch (err) {
      console.error("Error fetching current user:", err);
    }
  };

  const handleJoinEvent = async (eventId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `https://event-manager-2m60.onrender.com/api/events/${eventId}/attendees`,
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update the events state to trigger a re-render
      const updatedEvents = events.map((event) => {
        if (event._id === eventId) {
          return { ...event, attendees: [...event.attendees, userId] };
        }
        return event;
      });
      setEvents(updatedEvents);
    } catch (err) {
      console.error("Error joining event:", err);
      if (err.response && err.response.data.error === "User already joined the event") {
        alert("You have already joined this event.");
      }
    }
  };

  const handleLeaveEvent = async (eventId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://event-manager-2m60.onrender.com/api/events/${eventId}/attendees`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { userId },
      });

      // Update the events state to trigger a re-render
      const updatedEvents = events.map((event) => {
        if (event._id === eventId) {
          return {
            ...event,
            attendees: event.attendees.filter((attendee) => attendee !== userId),
          };
        }
        return event;
      });
      setEvents(updatedEvents);
    } catch (err) {
      console.error("Error leaving event:", err);
    }
  };

  const applyFilters = () => {
    let filtered = events;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (event) =>
          event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply date filter
    if (filterDate) {
      filtered = filtered.filter(
        (event) => new Date(event.date).toDateString() === new Date(filterDate).toDateString()
      );
    }

    // Apply creater filter (
    if (filterCreater) {
      filtered = filtered.filter((event) => event.createdBy.username.toLowerCase().includes(filterCreater.toLowerCase()));
      
    }

    setFilteredEvents(filtered);
  };

  useEffect(() => {
    // Listen for real-time attendee updates
    socket.on("attendeesUpdated", (updatedEventId) => {
      fetchEvents(); // Refresh the events list
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold mb-2 text-center">Welcome to Event Manager</h1>
      <span className="w-80 h-1 block mb-8 bg-fuchsia-400 rounded my-1.5"></span>
      <div className="mb-8 space-y-4">
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <div className="flex space-x-4">
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <input
              value={filterCreater}
              onChange={(e) => setFilterCreater(e.target.value)}
              className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Creater"
            />
          </div>
        </div>

      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">All Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <div
              key={event._id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow relative"
            >
              <div className="relative">
                <span className="absolute -top-7 right-0"><MdOutlineEventNote className="text-[70px] text-gray-100"/></span>
                <h3 className="text-xl font-semibold mb-2">{event.name}</h3>
                <span className="w-10 h-1 block bg-green-300 rounded my-1.5"></span>
                <p className="text-gray-600 mb-4">{event.description}</p>
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Date:</span>{" "}
                  {new Date(event.date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Created By:</span> {event.createdBy.username}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Attendees:</span> {event.attendees.length}
                </p>
              </div>

              <div className="mt-4 cursor-pointer absolute bottom-6 right-6">
                  {userId && !event.attendees.includes(userId) && (
                    <button
                      onClick={() => handleJoinEvent(event._id)}
                      className="mt-4 bg-transparent hover:text-white px-4 py-2 rounded-lg transition-all text-green-500 hover:bg-green-500 border-2 border-green-500 font-bold "
                    >
                      Join Event
                    </button>
                  )}
                  {userId && event.attendees.includes(userId) && (
                    <button
                      onClick={() => handleLeaveEvent(event._id)}
                      className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg transition-all hover:bg-transparent hover:text-red-500 border-2 border-red-500 hover:font-bold "
                    >
                      Leave Event
                    </button>
                  )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;