const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const socketIo = require("socket.io");
const dbConnect = require("./utils/db");
const http = require("http");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// dbConnect();

// Socket.io setup
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

// Pass the Socket.IO instance to the request object
app.use((req, res, next) => {
  req.io = io;
  next();
});

io.on("connection", (socket) => {
  console.log("A user connected");

  // Handle attendee updates
  socket.on("updateAttendees", (eventId) => {
    // Emit the updated attendee count to all clients
    io.emit("attendeesUpdated", eventId);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});


// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/events", require("./routes/event"));

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    dbConnect();
});