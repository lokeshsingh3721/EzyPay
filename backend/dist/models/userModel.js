"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = new mongoose_1.default.Schema({
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
module.exports = mongoose_1.default.model("UserModel", Schema);
