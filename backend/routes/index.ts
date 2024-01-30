import express from "express";
const router = express.Router();

import userRouter from "./userRoute";
import accountRouter from "./accountRoute";

router.use("/user", userRouter);
router.use("/account", accountRouter);

export = router;
