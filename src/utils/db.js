const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const config = {
  username: process.env.USER_NAME,
  password: process.env.PASSWORD,
  cluster: process.env.CLUSTER,
  database: process.env.DB,
  getMongoURL: function () {
    return `mongodb+srv://${this.username}:${this.password}@${this.cluster}/${this.database}`;
  },
};

function connectDB() {
  mongoose
    .connect(config.getMongoURL(), {
      retryWrites: true,
      w: "majority",
    })
    .then(() => {
      console.log("SUCCESS CONNECTION");
    })
    .catch((err) => console.log(err));
}

function disconnectDB() {
  mongoose
    .disconnect()
    .then(() => {
      console.log("DISCONNECTED FROM DATABASE");
    })
    .catch((err) => console.log(err));
}

module.exports = {
  config,
  connectDB,
  disconnectDB,
};
