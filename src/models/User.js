const mongoose = require("mongoose");
const { connectDB } = require("../utils/db");
const bcrypt = require("bcrypt");
const Playlist = require("../models/Playlist");

const DEFAULT_USER_PHOTO =
  "https://slack-imgs.com/?c=1&o1=ro&url=https%3A%2F%2Fcdn3d.iconscout.com%2F3d%2Fpremium%2Fthumb%2Fuser-4620688-3833029.png%3Ff%3Dwebp";

const userSchema = new mongoose.Schema({
  email: { type: String, required: false },
  nickname: { type: String, required: true },
  password: { type: String, required: false },
  photoUrl: { type: String, required: false, default: DEFAULT_USER_PHOTO },
  isMember: { type: Boolean, required: true },
  playlist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Playlist",
    required: false,
  },
  acceptPlaylist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Playlist",
    required: false,
  },
  rejectPlaylist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Playlist",
    required: false,
  },
});

const visibleUser = userSchema.virtual("visibleUser");
visibleUser.get(function (value, virtual, doc) {
  return {
    _id: doc._id,
    email: doc.email,
    nickname: doc.nickname,
  };
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
    const isMemeber = true;

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

userSchema.statics.memberLogin = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);

    if (auth) {
      return user.visibleUser;
    }
    throw Error("incorrect password");
  }
  throw Error("incorrect email");
};

userSchema.statics.guestLogin = async function (nickname) {
  const isMember = false;
  const user = await this.create({ nickname, isMember });
  return { _id: user._id, nickname: user.nickname };
};

const User = mongoose.model("User", userSchema);
module.exports = User;
