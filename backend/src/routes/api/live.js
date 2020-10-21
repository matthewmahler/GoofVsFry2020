const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  console.log(JSON.parse(req.query.json));
  res.status(200).json({ msg: "gottem" });
});

module.exports = router;
