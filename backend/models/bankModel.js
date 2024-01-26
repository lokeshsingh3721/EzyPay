const mongoose = require("mongoose");
const { Schema } = mongoose;

const schema = Schema({
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

module.exports = mongoose.model("Bank", schema);
