const socket = io();

// Elements
const messageForm = document.querySelector("#form");
const messageInput = document.querySelector("input");
const messageBtn = document.querySelector("button");
const locationBtn = document.getElementById("location");
const message = document.querySelector("#message");

// templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector("#location-template").innerHTML;
const listTemplate = document.querySelector("#sidebar-template").innerHTML;

// options
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const autoscroll = () => {
  const $newMessage = message.lastElementChild;

  const newMessageStyles = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

  const visibleHeight = message.offsetHeight;

  const containerHeight = message.scrollHeight;

  const scrollOffset = message.scrollTop + visibleHeight;

  if (containerHeight - newMessageHeight <= scrollOffset) {
    message.scrollTop = message.scrollHeight;
  }
};

socket.on("message", (msg) => {
  const html = Mustache.render(messageTemplate, {
    username: msg.username,
    message: msg.text,
    createdAt: moment(msg.createdAt).format("h:mm a"),
  });
  message.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

socket.on("locationMessage", (locationMessage) => {
  const html = Mustache.render(locationTemplate, {
    location: locationMessage.text,
    createdAt: moment(locationMessage.createdAt).format("h:mm a"),
  });
  message.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

socket.on("roomData", ({ room, users }) => {
  const html = Mustache.render(listTemplate, {
    room,
    users,
  });
  document.querySelector("#sidebar").innerHTML = html;
});

document.querySelector("#form").addEventListener("submit", (e) => {
  e.preventDefault();

  messageBtn.setAttribute("disabled", "disabled");

  const msg = document.querySelector("input").value;

  socket.emit("sendMessage", msg, (callbackMsg) => {
    messageBtn.removeAttribute("disabled");
    messageInput.value = "";
    messageInput.focus();
    console.log("Message Delivered!", callbackMsg);
  });
});

document.querySelector("#location").addEventListener("click", (e) => {
  if (!navigator.geolocation) {
    return alert("System does not support");
  }
  locationBtn.setAttribute("disabled", "disabled");

  navigator.geolocation.getCurrentPosition((position) => {
    const lat = position.coords.latitude;
    const long = position.coords.longitude;

    socket.emit("sendLocation", { lat, long }, () => {
      locationBtn.removeAttribute("disabled");
      console.log("Location Shared!");
    });
  });
});

socket.emit("join", { username, room }, (error) => {
  alert(error);
  window.location.href = "/";
});
