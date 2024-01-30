"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const userHandle_1 = require("../handlers/userHandle");
const router = express_1.default.Router();
const auth = require("../middlewares/auth");
router.post("/signup", userHandle_1.signup);
router.post("/signin", userHandle_1.signin);
router.put("/update", auth, userHandle_1.update);
router.get("/bulk", auth, userHandle_1.filterUser);
router.get("/getUser", auth, userHandle_1.getUser);
module.exports = router;
