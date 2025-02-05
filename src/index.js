const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const { formatMessage } = require("./utils/messages");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 8080;
const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));

io.on("connection", (socket) => {
  console.log("New Websocket connected");

  socket.emit("message", formatMessage("Welcome!"));
  socket.broadcast.emit("message", formatMessage("A new user has joined!"));

  socket.on("sendMessage", (msg, callback) => {
    // socket.broadcast.emit("message", msg);
    io.emit("message", formatMessage(msg));
    callback("Delivered");
  });

  socket.on("sendLocation", ({ lat, long }, callback) => {
    io.emit(
      "locationMessage",
      formatMessage(`https://google.com/maps?q=${lat},${long}`)
    );
    callback();
  });
});

server.listen(port, () => {
  console.log(`Server started at port ${port}`);
});
