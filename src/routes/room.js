const express = require("express");
const router = express.Router();

const Music = require("../models/Music");
const Playlist = require("../models/Playlist");
const Room = require("../models/Room");
const User = require("../models/User");

router.get("/", function (req, res, next) {
  try {
    const rooms = Room.find({});
    res.send(rooms);
  } catch (err) {
    console.log("get err: ", err);
  }
});

router.post("/", async function (req, res, next) {
  try {
    const { userId } = req.body;
    const code = getCode();

    const currentMusic = await Music.create({
      title: "first",
      artist: "first",
      comment: "first",
      proposer: userId,
      link: "first",
      agree: 0,
      reject: 0,
    });

    const remainPlaylist = await Playlist.create({
      musics: [],
    });

    const acceptPlaylist = await Playlist.create({
      musics: [],
    });

    const rejectPlaylist = await Playlist.create({
      musics: [],
    });

    const room = await Room.create({
      code: code,
      users: [userId],
      currentMusicId: currentMusic._id,
      remainPlaylist: remainPlaylist,
      acceptPlaylist: acceptPlaylist,
      rejectPlaylist: rejectPlaylist,
    });

    res.send(room);
  } catch (err) {
    console.log("post err: ", err);
  }
});

function getCode() {
  let code = 0;
  while (code === 0 || isUnique(code) == false) {
    code = Math.floor(1000 + Math.random() * 9000);
  }
  return code;
}

// Room post 후에 확인 필요
async function isUnique(code) {
  const result = Room.findOne({ code: code });
  if (result) {
    return false;
  }
  return true;
}

module.exports = router;
