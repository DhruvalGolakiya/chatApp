const express = require("express");
const connectdb = require("../dbconnect");
const Chats = require("../models/Chat");

const router = express.Router();

router.route("/").get((req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  res.statusCode = 200;

  connectdb.then((db) => {
    // let data = Chats.find({sender:'test1'});
    Chats.find({}).then((chat) => {
      res.json(chat);
    });
  });
});

module.exports = router;
