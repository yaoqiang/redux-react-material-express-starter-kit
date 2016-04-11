import express from "express"

import { authenticationAccount } from "../filter/authFilter";

const router = express.Router();

router.get("/", (req, res) => {
  console.log("/...");
  res.send(200);
});

router.post("/login", (req, res) => {
  console.log("login...");
  const { username, password } = req.body
  console.log(username, password);

  if (username === 'admin' && password === 'admin') {
    res.send({token: username});
    return;
  }
  res.send({err: 'invalid username/password'});
});

router.post("/logout", authenticationAccount, (req, res) => {
  console.log("logout...");
  res.send(200);
});

export default router;
