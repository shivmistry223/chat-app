const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const { formatMessage } = require("./utils/messages");
const {
  addUser,
  removerUser,
  getUser,
  getUsersInRoom,
} = require("./utils/users");
const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 8080;
const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));

io.on("connection", (socket) => {
  socket.on("join", ({ username, room }, callback) => {
    socket.join(room);
    const { error, user } = addUser(socket.id, username, room);

    if (error) {
      return callback(error);
    }

    socket.emit("message", formatMessage("Admin", `Welcome ${user.username}`));

    socket.broadcast
      .to(user.room)
      .emit("message", formatMessage("Admin", `${user.username} has joined!`));

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
  });

  socket.on("sendMessage", (msg, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit("message", formatMessage(user.username, msg));
    callback("Delivered");
  });

  socket.on("sendLocation", ({ lat, long }, callback) => {
    const { user } = getUser(socket.id);

    io.to(user.room).emit(
      "locationMessage",
      formatMessage(user.username, `https://google.com/maps?q=${lat},${long}`)
    );
    callback();
  });

  socket.on("disconnect", () => {
    const user = removerUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage("Admin", `${user.username} has left`)
      );

      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});

server.listen(port, () => {
  console.log(`Server started at port ${port}`);
});
