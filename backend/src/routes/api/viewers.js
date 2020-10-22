const express = require("express");
const router = express.Router();
const Viewer = require("../../models/Viewer");

// Get all viewers
router.get("/", async (req, res) => {
  const viewers = await Viewer.findAll({
    attributes: ["username", "lastVoteDate", "lastWatchDate"],
  }).catch(errHandler);
  res.json(viewers);
});

// Get single viewer
router.get("/:username", async (req, res) => {
  const viewer = await Viewer.findOne({
    where: {
      username: req.params.username,
    },
  }).catch(errHandler);
  if (viewer) {
    res.status(200).json(viewer);
  } else {
    res.status(400).json({ msg: "viewer not found" });
  }
});

// Create viewer
router.post("/", async (req, res) => {
  const newViewer = {
    username: req.body.username,
    lastVoteDate: req.body.lastVoteDate,
    lastWatchDate: req.body.lastWatchDate,
    canVote: req.body.canVote,
  };

  if (!newViewer.username) {
    return res.status(400).json({ msg: "Idk i fucked up" });
  }

  const viewer = await Viewer.create(newViewer).catch(errHandler);

  if (viewer) {
    res.json(viewer);
  } else {
    res.status(500).json({ msg: "internal db error occoured" });
  }
});

// Update viewer
router.put("/:username", async (req, res) => {
  const viewer = await Viewer.findOne({
    where: {
      username: req.params.username,
    },
  }).catch(errHandler);

  if (viewer) {
    const updViewer = req.body;
    viewer.lastVoteDate = updViewer.lastVoteDate
      ? updViewer.lastVoteDate
      : viewer.lastVoteDate;
    viewer.lastWatchDate = updViewer.lastWatchDate
      ? updViewer.lastWatchDate
      : viewer.lastWatchDate;
    viewer.canVote = updViewer.canVote ? updViewer.canVote : viewer.canVote;

    const result = await viewer.save().catch(errHandler);

    res.json({ msg: "viewer updated", updViewer, result });
  } else {
    res.status(400).json({ msg: "viewer not found" });
  }
});

// Helpers
const errHandler = (err) => {
  console.log("Error: ", err);
};

module.exports = router;
