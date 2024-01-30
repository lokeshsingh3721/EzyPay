"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const SECRET_KEY = "NO_SECRET_KEY";
function auth(req, res, next) {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.json({
                success: false,
                message: "token is not provided",
            });
        }
        const payload = jsonwebtoken_1.default.verify(token.split(" ")[1], SECRET_KEY);
        if (!payload) {
            return res.json({
                success: false,
                message: "invalid token",
            });
        }
        req.headers["userId"] = payload.userId;
        next();
    }
    catch (error) {
        if (error instanceof Error) {
            res.json({
                success: false,
                error: error.message,
            });
        }
    }
}
module.exports = auth;
