const express = require("express");
const router = express.Router();
const Vote = require("../../models/Vote");

// Get all votes
router.get("/", async (req, res) => {
  const votes = await Vote.findAll({
    attributes: ["userId", "username", "voteDate", "candidate", "voteId"],
  }).catch(errHandler);
  res.json(votes);
});

// Get all vote from user
router.get("/:userId", async (req, res) => {
  const votes = await Vote.findAll({
    where: {
      userId: req.params.userId,
    },
  }).catch(errHandler);

  if (votes) {
    res.json(votes);
  } else {
    res.status(400).json({ msg: "votes not found" });
  }
});

// Create vote
router.post("/", async (req, res) => {
  const newVote = {
    username: req.body.username,
    userId: req.body.userId,
    voteId: req.body.voteId,
    voteDate: req.body.voteDate,
    candidate: req.body.candidate,
  };

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
