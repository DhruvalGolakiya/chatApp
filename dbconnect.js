const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");

const url = "mongodb+srv://Dhruval:DhruvalMDDK257@cluster0.eus4ytk.mongodb.net/test";

const connect = mongoose.connect(url, { useNewUrlParser: true,useUnifiedTopology: true  });

module.exports = connect;
