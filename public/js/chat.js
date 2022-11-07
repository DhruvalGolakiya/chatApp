var socket = io();
var Dhruvalsocket = io("/dhruval");
var messages = document.getElementById("messages");
var userList = document.getElementById("user-list");
let Username;
const inboxPeople = document.querySelector(".inbox__people");

while (!Username) {
  Username = prompt("Enter your name");
}

(function () {
  $("form").submit(function (e) {
    let li = document.createElement("li");
    e.preventDefault(); // prevents page reloading
    socket.emit("chat message", $("#message").val(), Username);
    li.style.marginLeft = "80rem";

    messages.appendChild(li).append($("#message").val());
    let span = document.createElement("span");
    span.style.marginLeft = "80rem";
    messages
      .appendChild(span)
      .append("by " + `${Username}` + ": " + "just nowwwwww");

    $("#message").val("");

    return false;
  });

  socket.emit("user-connect", Username);
  socket.on("online-user", (onlineUsers) => {
    let li = document.createElement("li");
    li.style.color = "red";
    userList.appendChild(li).append(onlineUsers);
  });
  socket.on("userCount", function (data) {
    let userCount = document.getElementById("user-count");
    userCount.innerText = data.userCount;
  });

  socket.on("received", (data) => {
    let li = document.createElement("li");
    let span = document.createElement("span");
    var messages = document.getElementById("messages");
    messages.appendChild(li).append(data.message);
    messages
      .appendChild(span)
      .append("by " + `${Username}` + ": " + "just now");
  });
})();

// FROM DATABASE

(function () {
  fetch("/chats")
    .then((data) => {
      return data.json();
    })
    .then((json) => {
      json.map((data) => {
        let li = document.createElement("li");
        let span = document.createElement("span");
        messages.appendChild(li).append(data.message);
        messages
          .appendChild(span)
          .append("by " + data.sender + ": " + formatTimeAgo(data.createdAt));
      });
    });
})();

const chatMessages = document.querySelector(".chat-messages");

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);
});

socket.emit("joinRoom", { username });

function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  const p = document.createElement("p");
  p.classList.add("meta");
  p.innerText = message.username;
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement("p");
  para.classList.add("text");
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector(".chat-messages").appendChild(div);
}

// //is typing...

// let messageInput = document.getElementById("message");
// let typing = document.getElementById("typing");

// //isTyping event
// messageInput.addEventListener("keypress", () => {
//   socket.emit("typing", { user: "Someone", message: "is typing..." });
// });

// socket.on("notifyTyping", data => {
//   typing.innerText = data.user + " " + data.message;
//   console.log(data.user + data.message);
// });

// //stop typing
// messageInput.addEventListener("keyup", () => {
//   socket.emit("stopTyping", "");
// });

// socket.on("notifyStopTyping", () => {
//   typing.innerText = "";
// });
