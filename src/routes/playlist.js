const express = require("express");
const router = express.Router();

const Music = require("../models/Music");
const Playlist = require("../models/Playlist");
const Room = require("../models/Room");
const User = require("../models/User");

router.get("/info/:playlistId", async function (req, res, next) {
  try {
    const playlistId = req.params.playlistId;

    const playlist = await Playlist.getPlaylist(playlistId);
    res.send(playlist);
  } catch (err) {
    res.send(err);
  }
});

router.put("/music", async function (req, res, next) {
  try {
    const { musicId, playlistId, isAdd } = req.body;

    let updateQuery = {};
    if (isAdd) {
      updateQuery = { $push: { musics: musicId } };
    } else {
      updateQuery = { $pull: { musics: musicId } };
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
      playlistId,
      updateQuery,
      { new: true }
    );
    res.send(updatedPlaylist);
  } catch (err) {
    res.send(err);
  }
});

// router.delete("/music", async function (req, res, next) {
//   try {
//     const { musicId, playlistId } = req.body;

//     const updatedPlaylist = await Playlist.findByIdAndUpdate(
//       playlistId,
//       { $pull: { musics: musicId } },
//       { new: true }
//     );
//     res.send(updatedPlaylist);
//   } catch (err) {
//     res.send(err);
//   }
// });

module.exports = router;
