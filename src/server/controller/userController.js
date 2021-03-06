import express from "express"

const router = express.Router();

router.get("/", (req, res) => {
  console.log("/...");
  res.send(200);
});

router.get("/list", (req, res) => {
  console.log("list...");
  res.send(200);
});

router.get("/:id", (req, res) => {
  console.log("get...");
  res.send(200);
});

router.post("/create", (req, res) => {
  console.log("create...");
  res.send(200);
});

router.post("/delete", (req, res) => {

});

export default router;
