const express = require("express");
const router = express.Router();

const Music = require("../models/Music");
const Playlist = require("../models/Playlist");
const Room = require("../models/Room");
const User = require("../models/User");
const { createError, BAD_REQUEST } = require("../utils/error");

router.post("/create", async function (req, res, next) {
  try {
    const { userId } = req.body;
    const code = getCode();

    // const currentMusic = await Music.create({
    //   title: "first",
    //   artist: "first",
    //   comment: "first",
    //   proposer: userId,
    //   link: "first",
    //   agree: 0,
    //   reject: 0,
    // });

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
      // currentMusicId: currentMusic._id,
      remainPlaylist: remainPlaylist,
      acceptPlaylist: acceptPlaylist,
      rejectPlaylist: rejectPlaylist,
    });

    res.send(room);
  } catch (err) {
    res.send(err);
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

router.get("/info/id/:roomId", async function (req, res, next) {
  try {
    const roomId = req.params.roomId;
    const room = await Room.findOne({ _id: roomId });
    res.send(room);
  } catch (err) {
    res.send(err);
  }
});

router.get("/info/code/:roomCode", async function (req, res, next) {
  try {
    const roomCode = req.params.roomCode;
    const room = await Room.findOne({ code: roomCode });
    if (!room) {
      return res.status(404).json(createError(BAD_REQUEST, "Room not found."));
    }
    return res.send(room);
  } catch (err) {
    return next(err);
  }
});

router.put("/user", async function (req, res, next) {
  try {
    const { roomId, userId, isAdd } = req.body;

    let updateQuery = {};
    if (isAdd) {
      updateQuery = { $push: { users: userId } };
    } else {
      updateQuery = { $pull: { users: userId } };
    }

    const updatedRoom = await Room.findByIdAndUpdate(roomId, updateQuery, {
      new: true,
    });
    res.send(updatedRoom);
  } catch (err) {
    res.send(err);
  }
});

// router.delete("/user", async function (req, res, next) {
//   try {
//     const { roomId, userId } = req.body;

//     const room = await Room.findByIdAndUpdate(
//       roomId,
//       { $pull: { users: userId } },
//       { new: true }
//     );
//     res.send(room);
//   } catch (err) {
//     res.send(err);
//   }
// });

module.exports = router;
