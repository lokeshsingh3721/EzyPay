import express from "express";
import {
  signin,
  signup,
  update,
  filterUser,
  getUser,
} from "../handlers/userHandle";
const router = express.Router();

const auth = require("../middlewares/auth");

router.post("/signup", signup);
router.post("/signin", signin);
router.put("/update", auth, update);
router.get("/bulk", auth, filterUser);
router.get("/getUser", auth, getUser);

export = router;
