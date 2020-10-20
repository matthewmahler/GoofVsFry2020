const express = require("express");
const router = express.Router();
const Vote = require("../../models/Vote");

// Get all votes
router.get("/", async (req, res) => {
  const votes = await Vote.findAll({
    attributes: ["id", "userusername", "voteDate", "candidate"],
  }).catch(errHandler);
  res.json(votes);
});

// Create vote
router.post("/", async (req, res) => {
  const newVote = {
    username: req.body.username,
    id: req.body.id,
    voteDate: new Date().toISOString(),
    candidate: req.body.candidate,
  };

  if (!newVote.username || !newVote.email) {
    return res.status(400).json({ msg: "Please include a username and email" });
  }

  const vote = await Vote.create(newVote).catch(errHandler);

  if (vote) {
    res.json(vote);
  } else {
    res.status(500).json({ msg: "internal db error occoured" });
  }
});

// Helpers
const errHandler = (err) => {
  console.log("Error: ", err);
};

module.exports = router;
