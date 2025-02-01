const express = require("express");
const { createEvent, getEvents, updateEvent, deleteEvent, addAttendee, removeAttendee, getAllEvents } = require("../controllers/eventController");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/", auth, createEvent);
router.get("/getEvents", auth, getEvents);
router.put("/:id", auth, updateEvent);
router.delete("/:id", auth, deleteEvent);
router.get("/all", getAllEvents);

// Attendee routes
router.post("/:eventId/attendees", auth, addAttendee);
router.delete("/:eventId/attendees", auth, removeAttendee);

module.exports = router;