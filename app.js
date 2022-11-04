//require the express module
const express = require("express");
const app = express();
const dateTime = require("simple-datetime-formater");
const bodyParser = require("body-parser");
const chatRouter = require("./route/chatroute");

//require the http module
const http = require("http").Server(app);

// require the socket.io module
const io = require("socket.io");

const port = 3001;

//bodyparser middleware
app.use(bodyParser.json());

//routes
app.use("/chats", chatRouter);

//set the express.static middleware
app.use(express.static(__dirname + "/public"));

//integrating socketio
socket = io(http);

//database connection
const Chat = require("./models/Chat");
const connect = require("./dbconnect");
//setup event listener
socket.on("connection", (socket) => {
  console.log("user connected");

  socket.on("disconnect", function () {
    console.log("user disconnected");
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
  socket.on("new-user", (Username) => {
    // tempUser[socket.id] = Username;
    // console.log("tempUser");
    // console.log(json(tempUser));
  });
  socket.on("chat message", function (msg, name) {
    // console.log("message: " + msg);
    //broadcast message to everyone in port:5000 except yourself.
    socket.broadcast.emit("received", { message: msg});
    // console.log("name" +(tempUser));

    //save chat to the database
    connect.then((db) => {
      console.log("connected correctly to the server");
      let chatMessage = new Chat({ message: msg, sender: 'ff'});

      chatMessage.save();
    });
  });
});

http.listen(port, () => {
  console.log("Running on Port: " + port);
});
