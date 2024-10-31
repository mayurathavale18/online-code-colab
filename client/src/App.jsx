import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "./App.css";

const socket = io("https://online-code-colab.onrender.com/");

const App = () => {
  const [roomId, setRoomId] = useState("");
  const [currentRoomId, setCurrentRoomId] = useState("");
  const [code, setCode] = useState("");
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isInRoom, setIsInRoom] = useState(false); // New state to track if the user is in a room
  const [notification, setNotification] = useState("");

  useEffect(() => {
    socket.on("codeUpdate", (newCode) => {
      setCode(newCode);
    });

    socket.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on("roomCreated", (roomId) => {
      setCurrentRoomId(roomId);
      setIsInRoom(true); // User is now in a room
    });

    socket.on("roomExists", (roomId) => {
      setCurrentRoomId(roomId);
      setIsInRoom(true); // User is now in a room
    });

    socket.on("roomNotFound", () => {
      setNotification(
        "Room doesn't exist. Please join an existing room or create a new one."
      );
    });

    return () => {
      socket.off("codeUpdate");
      socket.off("receiveMessage");
      socket.off("roomCreated");
      socket.off("roomExists");
      socket.off("roomNotFound");
    };
  }, []);

  const joinRoom = () => {
    if (roomId.length === 6) {
      // Ensure room ID is 6 digits
      socket.emit("joinRoom", roomId);
      setCurrentRoomId(roomId);
      setIsInRoom(true); // User is now in a room
      setRoomId(""); // Clear input field after joining
    } else {
      setNotification("Please enter a valid 6-digit room ID.");
    }
  };

  const createRoom = () => {
    socket.emit("createRoom");
  };

  const leaveRoom = () => {
    socket.emit("leaveRoom", currentRoomId);
    setCurrentRoomId("");
    setIsInRoom(false); // Reset the state
    setMessages([]); // Clear messages
    setCode(""); // Clear the code area
    setNotification(""); // Clear any notifications
  };

  const handleCodeChange = (e) => {
    setCode(e.target.value);
    socket.emit("codeChange", { roomId: currentRoomId, code: e.target.value });
  };

  const sendMessage = () => {
    socket.emit("sendMessage", {
      roomId: currentRoomId,
      message: inputMessage,
    });
    setInputMessage(""); // Clear the input after sending
  };

  return (
    <div className="App">
      <h2>Online Code Collaboration</h2>

      {/* Room ID Input Field */}
      <input
        type="text"
        placeholder={isInRoom ? currentRoomId : "6-digit Room ID"}
        value={isInRoom ? "" : roomId}
        onChange={(e) => setRoomId(e.target.value)}
        maxLength={6} // Limit input to 6 characters
        disabled={isInRoom} // Disable input when in a room
      />
      <button onClick={joinRoom} disabled={isInRoom}>
        Join Room
      </button>
      <button onClick={createRoom} disabled={isInRoom}>
        Create Room
      </button>
      <button onClick={leaveRoom} disabled={!isInRoom}>
        Leave Room
      </button>
      <div>
        {notification && <p className="notification">{notification}</p>}
      </div>
      <div>
        <textarea
          value={code}
          onChange={handleCodeChange}
          placeholder="Start coding..."
        />
      </div>

      <div>
        <input
          type="text"
          placeholder="Type a message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>

      <div className="messages">
        <h3>Chat:</h3>
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>

      {/* Display the current room ID in the corner */}
      <div className="room-id-display">
        {currentRoomId && <p>Current Room: {currentRoomId}</p>}
      </div>
    </div>
  );
};

export default App;
