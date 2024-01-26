const mongoose = require("mongoose");

const Schema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    maxLength: 30,
    minLength: 3,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  firstName: {
    type: String,
    required: true,
    maxLength: 30,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    maxLength: 30,
    trim: true,
  },
});

module.exports = mongoose.model("UserModel", Schema);
