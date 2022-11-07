//require the express module
const express = require("express");
const app = express();
const dateTime = require("simple-datetime-formater");
const bodyParser = require("body-parser");
const chatRouter = require("./route/chatroute");

const http = require("http").Server(app);

const socketIO = require("socket.io");

const port = 3001;

//bodyparser middleware

//routes
//set the express.static middleware
app.use(express.static(__dirname + "/public"));
app.use("/chats", chatRouter);
io = socketIO(http);
const Chat = require("./models/Chat");
var activeUsers = new Chat();
const connect = require("./dbconnect");
let userCount = 0;
var onlineUsers = {};


io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username }) => {
    const user = username;
    socket.join("newRoom");
    socket.broadcast
      .to("newRoom")
      .emit("message", `${user} has joined the chat`);
  });

  console.log("hi");
  socket.on("user-connect", (Username) => {
    onlineUsers = Username;
    console.log(Username);
    socket.emit("online-user", onlineUsers);
  });
  userCount++;
  io.emit("userCount", { userCount: userCount });
  console.log("user connected");

  socket.on("disconnect", function () {
    userCount--;
    io.emit("userCount", { userCount: userCount });
    console.log("user disconnected");
  });

  socket.on("chat message", function (message, currentUser) {
    socket.broadcast.emit("received", { message: message, names: currentUser });

    //save chat to the database
    connect.then((db) => {
      console.log("connected correctly to the server");
      let chatMessage = new Chat({ message: message, sender: currentUser });

      chatMessage.save();
    });
  });
});

http.listen(port, () => {
  console.log("Running on Port: " + port);
});

// //Someone is typing
// socket.on("typing", (data) => {
//   socket.broadcast.emit("notifyTyping", {
//     user: data.user,
//     message: data.message,
//   });
// });

// //when soemone stops typing
// socket.on("stopTyping", () => {
//   socket.broadcast.emit("notifyStopTyping");
// });
// socket.on("new-user", (Username) => {

// });
