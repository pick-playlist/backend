const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema({
  musics: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Music", required: true },
  ],
});

const Playlist = mongoose.model("Playlist", playlistSchema);
module.exports = Playlist;