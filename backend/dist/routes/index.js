"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const userRoute_1 = __importDefault(require("./userRoute"));
const accountRoute_1 = __importDefault(require("./accountRoute"));
router.use("/user", userRoute_1.default);
router.use("/account", accountRoute_1.default);
module.exports = router;
