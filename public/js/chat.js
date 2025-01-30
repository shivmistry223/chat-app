const socket = io();

const messageForm = document.querySelector("#form");
const messageInput = document.querySelector("input");
const messageBtn = document.querySelector("button");
const locationBtn = document.getElementById("location");
const message = document.querySelector("#message");

// templates

const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector("#location-template").innerHTML;

socket.on("message", (msg) => {
  // console.log("server : " + msg);
  const html = Mustache.render(messageTemplate, { message: msg });
  message.insertAdjacentHTML("beforeend", html);
});

socket.on("locationMessage", (location) => {
  const html = Mustache.render(locationTemplate, { location });
  message.insertAdjacentHTML("beforeend", html);
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
