// server/server.js
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const socketIo = require("socket.io");
const cors = require("cors");
require("dotenv").config();

const Room = require("./models/Room.js");
const Message = require("./models/Message.js");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173", // Update this to match your frontend port
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"], // Allow specific headers if needed
    credentials: true, // Allow cookies to be sent
  },
});

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true, // Allow credentials if needed
  })
);
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Socket.io for real-time collaboration
io.on("connection", (socket) => {
  console.log("New client connected");

  // Join a room for collaboration
  socket.on("joinRoom", async (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);

    // Retrieve current code from the database
    const room = await Room.findOne({ roomId });
    if (room) {
      socket.emit("currentCode", room.code); // Send current code to the user
    }
  });

  // Create a new room
  socket.on("createRoom", async () => {
    let roomId;
    do {
      roomId = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a random 6-digit room ID
    } while (await Room.findOne({ roomId })); // Ensure the room ID is unique

    const newRoom = new Room({ roomId, code: "" }); // Create a new Room document
    await newRoom.save(); // Save the room to the database

    socket.join(roomId); // Automatically join the new room
    console.log(`Room created: ${roomId}`);

    socket.emit("roomCreated", roomId); // Send the new room ID back to the client
    // Notify other clients in the room
    socket
      .to(roomId)
      .emit(
        "roomNotification",
        `User ${socket.id} has created and joined room: ${roomId}`
      );
  });

  // Check if a room exists
  socket.on("checkRoom", async (roomId) => {
    const room = await Room.findOne({ roomId });
    if (room) {
      socket.emit("roomExists", roomId); // Notify client that the room exists
    } else {
      socket.emit("roomNotFound"); // Notify client that the room does not exist
    }
  });

  // Leave a room
  socket.on("leaveRoom", () => {
    const rooms = Object.keys(socket.rooms);
    rooms.forEach((roomId) => {
      if (roomId !== socket.id) {
        // Don't leave the socket's own room
        socket.leave(roomId);
        console.log(`User left room: ${roomId}`);
      }
    });
    socket.emit("roomLeft"); // Notify client they have left the room
  });

  // Listen for code changes and emit to the room
  socket.on("codeChange", async (data) => {
    // Update the code in the database
    await Room.findOneAndUpdate(
      { roomId: data.roomId },
      { code: data.code },
      { new: true }
    );
    // Emit code updates to all clients in the room
    socket.to(data.roomId).emit("codeUpdate", data.code);
  });

  // Handle chat messages
  socket.on("sendMessage", (data) => {
    console.log(`received: ${data.message}`);
    io.to(data.roomId).emit("receiveMessage", data.message);
  });

  // Inside your Socket.io connection logic
  socket.on("leaveRoom", (roomId) => {
    socket.leave(roomId);
    console.log(`User left room: ${roomId}`);
  });

  // Disconnect
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Start the server
server.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
