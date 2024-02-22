const express = require("express");
const router = express.Router();

const Music = require("../models/Music");
const Playlist = require("../models/Playlist");
const Room = require("../models/Room");
const User = require("../models/User");

router.post("/", function (req, res, next) {
  try {
    const { User } = req.body;
    console.log("User: ", User);
  } catch (err) {
    console.log("post err: ", err);
  }
});

module.exports = router;
