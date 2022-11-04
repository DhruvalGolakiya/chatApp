//require the express module
const express = require("express");
const app = express();
const dateTime = require("simple-datetime-formater");
const bodyParser = require("body-parser");
const chatRouter = require("./route/chatroute");

const http = require("http").Server(app);

const io = require("socket.io");

const port = 3001;

//bodyparser middleware
app.use(bodyParser.json());

//routes
app.use("/chats", chatRouter);
//set the express.static middleware
app.use(express.static(__dirname + "/public"));

socket = io(http);
const Chat = require("./models/Chat");
var activeUsers = new Chat();
const connect = require("./dbconnect");
const { stringify } = require("querystring");
let userCount = 0;
var onlineUsers = {};

socket.on("connection", (socket) => {
  socket.on("user-connect", (Username) => {
    onlineUsers = Username;
    console.log(Username);
    socket.emit("online-user", onlineUsers);
  });
  userCount++;
  socket.emit("userCount", { userCount: userCount });
  console.log("user connected");
  console.log(userCount);

  socket.on("disconnect", function () {
    userCount--;
    socket.emit("userCount", { userCount: userCount });
    console.log("user disconnected");
    console.log(userCount);
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
