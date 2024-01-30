import express from "express";
const router = express.Router();
import { transferFunds, balance } from "../handlers/bankHandlers";
import auth from "../middlewares/auth";

router.post("/transfer", auth, transferFunds);
router.get("/balance", auth, balance);

export = router;
