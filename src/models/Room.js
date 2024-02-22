const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema({
  code: { type: String, required: true },
  users: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ],
  currentMusicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Music",
    required: true,
  },
  remainPlaylist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Playlist",
    required: true,
  },
  acceptPlaylist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Playlist",
    required: true,
  },
  rejectPlaylist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Playlist",
    required: true,
  },
});

const Playlist = mongoose.model("Playlist", playlistSchema);
module.exports = Playlist;
