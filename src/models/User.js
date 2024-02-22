const mongoose = require("mongoose");
const { connectDB } = require("../utils/db");
const bcrypt = require("bcrypt");
const Playlist = require("../models/Playlist");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  nickname: { type: String, required: true },
  password: { type: String, required: true },
  isMemeber: { type: Boolean, required: true },
  playlist: {
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

userSchema.statics.isDuplicatedEmail = async function (email) {
  const user = await this.findOne({ email: email });
  return user !== null;
};

userSchema.statics.signUp = async function (email = null, nickname, password) {
  try {
    const salt = await bcrypt.genSalt();
    console.log(salt);

    const hashedPassword = await bcrypt.hash(password, salt);
    const isMemeber = email ? true : false;

    // 빈 플레이 리스트 부여
    const playlist = (await Playlist.create({ musics: [] }))._id;
    const acceptPlaylist = (await Playlist.create({ musics: [] }))._id;
    const rejectPlaylist = (await Playlist.create({ musics: [] }))._id;
    const user = await this.create({
      email,
      nickname,
      password: hashedPassword,
      isMemeber,
      playlist,
      acceptPlaylist,
      rejectPlaylist,
    });

    return { _id: user._id, nickname: user.nickname };
  } catch (err) {
    throw err;
  }
};

const User = mongoose.model("User", userSchema);
module.exports = User;
