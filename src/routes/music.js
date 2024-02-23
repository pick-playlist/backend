const express = require("express");
const router = express.Router();

const Music = require("../models/Music");
const Playlist = require("../models/Playlist");
const Room = require("../models/Room");
const User = require("../models/User");

router.post("/", async function (req, res, next) {
  try {
    const { title, artist, comment, userId, link } = req.body;

    const newMusic = await Music.create({
      title: title,
      artist: artist,
      comment: comment,
      proposer: userId,
      link: link,
      agree: 0,
      reject: 0,
    });

    res.send(newMusic);
  } catch (err) {
    res.send(err);
  }
});

router.get("/info", async function (req, res, next) {
  try {
    const { musicId } = req.body;

    const music = await Music.findOne({ _id: musicId });
    res.send(music);
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
