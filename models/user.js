const mongoose = require("mongoose");

const User = mongoose.model("User", {
  email: String,
  account: {
    username: String,
    avatar: Object,
  },
  token: String,
  hash: String,
  salt: String,
  favorites: {
    comics: Array,
    characters: Array,
  },
});

module.exports = User;
