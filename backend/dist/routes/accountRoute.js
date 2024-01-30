"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const bankHandlers_1 = require("../handlers/bankHandlers");
const auth_1 = __importDefault(require("../middlewares/auth"));
router.post("/transfer", auth_1.default, bankHandlers_1.transferFunds);
router.get("/balance", auth_1.default, bankHandlers_1.balance);
module.exports = router;
