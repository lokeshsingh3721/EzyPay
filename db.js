const mongoose = require("mongoose");
require("dotenv").config();

const URL = process.env.DATABASE_URL;

const dbConnect = async () => {
  try {
    await mongoose.connect(URL);
    console.log("DB connected successfully");
  } catch (error) {
    console.error("Error while connecting to the database:", error.message);
  }
};

module.exports = dbConnect;
