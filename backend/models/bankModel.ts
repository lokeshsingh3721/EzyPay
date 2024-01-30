import mongoose, { Schema } from "mongoose";

const schema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "UserModel",
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
});

export = mongoose.model("Bank", schema);
