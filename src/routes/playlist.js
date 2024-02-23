const express = require("express");
const router = express.Router();

const Music = require("../models/Music");
const Playlist = require("../models/Playlist");
const Room = require("../models/Room");
const User = require("../models/User");

router.put("/music", async function (req, res, next) {
  try {
    const { musicId, playlistId } = req.body;

    res.send(newMusic);
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
