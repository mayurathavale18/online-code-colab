Online Code Collaboration
```markdown

## Description

Online Code Collaboration is a real-time collaborative coding platform that allows multiple users to join a coding room and edit code together, similar to Google Docs. Users can create rooms, share a unique room ID, and chat in real-time.

## Features

- Create and join rooms with unique 6-digit IDs.
- Real-time code editing and message sharing.
- Automatic loading of previous activity when joining an existing room.
- Option to leave the room, resetting the UI for the user.

## Tech Stack

- **Frontend:** React.js
- **Backend:** Node.js, Express.js, Socket.io
- **Database:** MongoDB
- **Deployment:** Vercel (for frontend), Render (for backend)

## Installation

### Prerequisites

- Node.js
- MongoDB Atlas account (for cloud database)
- Git

### Clone the Repository

```bash
git clone https://github.com/your-username/online-code-colab.git
cd online-code-colab
```

### Setup Backend

1. Navigate to the server folder:

   ```bash
   cd server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the `server` directory with the following environment variables:

   ```plaintext
   MONGO_URI=your_mongodb_connection_string
   ```

4. Start the server:

   ```bash
   npm start
   ```

### Setup Frontend

1. Navigate to the client folder:

   ```bash
   cd ../client
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the React app:

   ```bash
   npm start
   ```

## Usage

1. Open the frontend in your browser at `http://localhost:5173`.
2. Users can create a new room or join an existing room using the provided room ID.
3. Once in a room, users can collaborate on code and send messages in real-time.
4. To leave a room, click the "Leave Room" button, which will reset the UI.

## Deployment

### Frontend Deployment (Vercel)

1. Sign up at [Vercel](https://vercel.com).
2. Import your GitHub repository and follow the prompts to deploy your React app.

### Backend Deployment (Render)

1. Sign up at [Render](https://render.com).
2. Create a new web service and connect it to your server repository.
3. Set environment variables in Render for your MongoDB connection string.
4. Deploy the service.

## Important Files

- `.gitignore`: Specifies files to ignore in version control (e.g., `.env`, `node_modules`).
- `README.md`: Documentation for the project.
- `server/models/Room.js`: MongoDB model for storing room data.
- `server/models/Message.js`: MongoDB model for storing messages.
- `server/server.js`: Main server file with Socket.io configuration.

## Contributing

Contributions are welcome! Please create a pull request for any improvements or fixes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```

### Notes:

- Replace `your-username` with your actual GitHub username.
- Ensure that the `MONGO_URI` in the `.env` section is correctly specified based on your MongoDB connection string.
- Adjust any project-specific details as needed, such as installation commands, if there are any additional steps or configurations.
- Add sections for any other functionalities or details that might be relevant to users or contributors.
