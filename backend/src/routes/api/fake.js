const express = require("express");
const router = express.Router();
const Vote = require("../../models/Vote");
const faker = require("faker");

router.get("/", async (req, res) => {
  const fakeDate = faker.date.between("2020-10-22", "2020-11-03");
  const newVote = {
    username: faker.internet.userName(),
    userId: faker.random.number(1000000000),
    voteId: faker.random.number(1000000000),
    voteDate: new Date(
      new Date(fakeDate).getFullYear(),
      new Date(fakeDate).getMonth(),
      new Date(fakeDate).getDate()
    ),
    candidate: faker.random.boolean() ? "Goof" : "Fry",
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
