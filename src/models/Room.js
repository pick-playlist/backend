const mongoose = require("mongoose");
const Playlist = require("./Playlist");
const User = require("./User");

const roomSchema = new mongoose.Schema({
  code: { type: String, required: true },
  hostUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  users: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ],
  currentMusicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Music",
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
  tags: {
    type: [String],
    required: true,
    default: [],
  },
});

const visibleRoom = roomSchema.virtual("visibleRoom");
visibleRoom.get(async function (value, virtual, doc) {
  // 방장
  let hostUser = await User.findById(doc.hostUser);
  hostUser = await hostUser.visibleUser;

  // 유저 목록 (방장 포함)
  const userPromises = doc.users.map(async (userId) => {
    const user = await User.findById(userId);
    return user.visibleUser;
  });
  const users = await Promise.all(userPromises);

  // 플레이리스트
  const playlistPromises = [
    Playlist.getPlaylist(doc.remainPlaylist),
    Playlist.getPlaylist(doc.acceptPlaylist),
    Playlist.getPlaylist(doc.rejectPlaylist),
  ];

  const [remainPlaylist, acceptPlaylist, rejectPlaylist] = await Promise.all(
    playlistPromises
  );

  const data = {
    _id: doc._id,
    code: doc.code,
    hostUser: hostUser,
    users: users,
    remainPlaylist: remainPlaylist,
    acceptPlaylist: acceptPlaylist,
    rejectPlaylist: rejectPlaylist,
    tags: doc.tags,
  };

  return data;
});

const Room = mongoose.model("Room", roomSchema);
module.exports = Room;
