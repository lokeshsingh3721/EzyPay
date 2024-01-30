import mongoose from "mongoose";

const Schema = new mongoose.Schema({
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

export = mongoose.model("UserModel", Schema);
