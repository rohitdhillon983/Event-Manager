import React, { useEffect, useState } from "react";
import axios from "axios";
import EventList from "../components/EventList";
import EventForm from "../components/EventForm";

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/events/getEvents", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Ensure the response data is an array
      if (Array.isArray(res.data)) {
        setEvents(res.data);
      } else {
        console.error("Expected an array of events, but got:", res.data);
        setEvents([]); // Set events to an empty array to avoid errors
      }
    } catch (err) {
      console.error("Error fetching events:", err);
      setEvents([]); // Set events to an empty array in case of an error
    }
  };

  const handleCreateEvent = async (eventData) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/events", eventData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchEvents();
      setShowForm(false);
    } catch (err) {
      console.error("Error creating event:", err);
    }
  };

  const handleUpdateEvent = async (eventData) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/events/${selectedEvent._id}`, eventData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchEvents();
      setSelectedEvent(null);
      setShowForm(false);
    } catch (err) {
      console.error("Error updating event:", err);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchEvents();
    } catch (err) {
      console.error("Error deleting event:", err);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <button
        onClick={() => {
          setSelectedEvent(null);
          setShowForm(!showForm);
        }}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-6 hover:text-blue-500 hover:bg-transparent border-2 hover:font-bold border-blue-500"
      >
        {showForm ? "Hide Form" : "Create Event"}
      </button>
      {showForm && (
        <EventForm
          onSubmit={selectedEvent ? handleUpdateEvent : handleCreateEvent}
          initialData={selectedEvent || {}}
        />
      )}
      <EventList
        events={events}
        onDelete={handleDeleteEvent}
        onUpdate={(event) => {
          setSelectedEvent(event);
          setShowForm(true);
        }}
      />
    </div>
  );
};

export default Dashboard;