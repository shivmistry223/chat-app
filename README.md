---

### 📱 Real-Time Chat App using Node.js, Express & Socket.io

This is a real-time web-based chat application built as a project in a Node.js course. It allows multiple users to join chat rooms and communicate instantly with each other using WebSockets.

#### 🔧 Technologies Used:
- **Node.js** – JavaScript runtime environment
- **Express.js** – Lightweight server framework
- **Socket.io** – Real-time bidirectional communication
- **HTML/CSS** – For UI layout and styling
- **JavaScript (Vanilla)** – For client-side logic
- **Mustache.js** – Template rendering for dynamic messages
- **Moment.js** – For formatting timestamps

#### ✅ Features:
- Join chat rooms with a username and room name
- Real-time messaging between users
- Location sharing (sends live location using Geolocation API)
- Displays user list per chat room
- Auto-scrolls new messages
- Simple and clean UI
- Profanity filter to keep messages clean

#### 🚀 How It Works:
1. Users enter their name and room to join.
2. The server creates or joins a Socket.io room.
3. Messages are broadcasted to all users in the same room.
4. Location data is also shared as a Google Maps link.

#### 📁 Folder Structure:
```
/public        - Client-side code
/src
  └── /utils   - Helper functions
  └── /models  - Message formatting
  └── index.js - Main server file
```

---
