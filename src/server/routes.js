import express from "express"

import { authenticationAccount } from "./filter/authFilter";

import authController from "./controller/authController"
import userController from "./controller/userController"

const router = express.Router();


router.use("/auth", authController);

router.use("/user", authenticationAccount, userController);


router.use("/*", (req, res) => {
  res.sendStatus(404);
});

export default router;
