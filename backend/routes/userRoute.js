const express = require("express");
const {
  signup,
  signin,
  update,
  filterUser,
  getUser,
} = require("../handlers/userHandle");
const router = express.Router();

const auth = require("../middlewares/auth");

router.post("/signup", signup);
router.post("/signin", signin);
router.put("/update", auth, update);
router.get("/bulk", auth, filterUser);
router.get("/getUser", auth, getUser);

module.exports = router;
