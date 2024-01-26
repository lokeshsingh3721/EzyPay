const jwt = require("jsonwebtoken");
require("dotenv").config();

function auth(req, res, next) {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.json({
        success: false,
        message: "token is not provided",
      });
    }

    const payload = jwt.verify(token.split(" ")[1], process.env.SECRET_KEY);

    if (!payload) {
      return res.json({
        success: false,
        message: "invalid token",
      });
    }
    req.userId = payload.userId;
    next();
  } catch (error) {
    res.json({
      success: false,
      error: error.message,
    });
  }
}

module.exports = auth;
