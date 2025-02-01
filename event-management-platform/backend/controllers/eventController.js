const Event = require("../models/Event");

exports.createEvent = async (req, res) => {
  const { name, description, date } = req.body;
  try {
    const event = new Event({ name, description, date, createdBy: req.user.id });
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const id = req.user.id;
    console.log(id);
    const events = await Event.find({ createdBy: id }).populate("createdBy", "username");
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("createdBy", "username");
    res.json(events); 
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateEvent = async (req, res) => {
  const { name, description, date } = req.body;
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });
    if (event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }
    event.name = name;
    event.description = description;
    event.date = date;
    await event.save();
    res.status(200).json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });    
    if (event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }
    await event.remove();
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addAttendee = async (req, res) => {
  const { eventId } = req.params;
  // const { userId } = req.body;
  const userId = req.user.id;

  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ error: "Event not found" });

    // Check if the user is already an attendee
    if (event.attendees.includes(userId)) {
      return res.status(400).json({ error: "User already joined the event" });
    }

    // Add the user to the attendees list
    event.attendees.push(userId);
    await event.save();

    // Emit a Socket.IO event to update attendees in real-time
    req.io.emit("attendeesUpdated", eventId);

    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.removeAttendee = async (req, res) => {
  const { eventId } = req.params;
  // const { userId } = req.body;
  const userId = req.user.id;
  // console.log(eventId);
  try {
    const event = await Event.findById(eventId);
    // console.log(event);
    if (!event) return res.status(404).json({ error: "Event not found" });

    // Remove the user from the attendees list
    event.attendees = event.attendees.filter((attendee) => attendee.toString() !== userId);
    await event.save();

    // Emit a Socket.IO event to update attendees in real-time
    req.io.emit("attendeesUpdated", eventId);

    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};
