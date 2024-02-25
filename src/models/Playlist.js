const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema({
  musics: [{ type: mongoose.Schema.Types.ObjectId, ref: "Music" }],
});

playlistSchema.statics.getPlaylist = async function (playlistId) {
  const playlist = (await this.findById(playlistId).populate("musics")) || [];
  return playlist;
};

const Playlist = mongoose.model("Playlist", playlistSchema);
module.exports = Playlist;
