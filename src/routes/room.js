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
      hostUser: userId,
      remainPlaylist: remainPlaylist,
      acceptPlaylist: acceptPlaylist,
      rejectPlaylist: rejectPlaylist,
      tags: [],
    });

    const visibleRoom = await room.visibleRoom;
    res.send(visibleRoom);
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
    if (!room) {
      return res.status(404).json(createError(BAD_REQUEST, "Room not found."));
    }
    const visibleRoom = await room.visibleRoom;
    return res.json(visibleRoom);
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
    const visibleRoom = await room.visibleRoom;
    return res.json(visibleRoom);
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

    const visibleRoom = await updatedRoom.visibleRoom;
    res.send(visibleRoom);
  } catch (err) {
    res.send(err);
  }
});

router.put("/info/tags/:roomId", async function (req, res, next) {
  console.log("hrere");
  try {
    const { roomId } = req.params; // 방 ID 가져오기
    console.log(roomId);
    const tags = req.body.tags;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json(createError(BAD_REQUEST, "Room not found."));
    }

    room.tags.push(...tags);

    const updatedRoom = await room.save();
    const visibleRoom = await updatedRoom.visibleRoom;
    return res.json(visibleRoom);
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
