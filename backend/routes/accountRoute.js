const express = require("express");
const router = express.Router();
const { transferFunds, balance } = require("../handlers/bankHandlers");
const auth = require("../middlewares/auth");

router.post("/transfer", auth, transferFunds);
router.get("/balance", auth, balance);

module.exports = router;
