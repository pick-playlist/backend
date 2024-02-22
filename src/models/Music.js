const mongoose = require("mongoose");

const musicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  comment: { type: String, required: true },
  proposer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  link: { type: String, required: true },
  agree: { type: Number, required: true },
  reject: { type: Number, required: true },
});

const Music = mongoose.model("Music", musicSchema);
module.exports = Music;
