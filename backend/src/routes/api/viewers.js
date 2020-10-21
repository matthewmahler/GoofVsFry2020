const express = require("express");
const router = express.Router();
const Viewer = require("../../models/Viewer");

// Get all viewers
router.get("/", async (req, res) => {
  const viewers = await Viewer.findAll({
    attributes: ["userId", "username", "lastVoteDate", "lastWatchDate"],
  }).catch(errHandler);
  res.json(viewers);
});

// Get single viewer
router.get("/:userId", async (req, res) => {
  const viewer = await Viewer.findAll({
    where: {
      userId: req.params.userId,
    },
  }).catch(errHandler);

  if (viewer && Viewer.length > 0) {
    res.json(viewer);
  } else {
    res.status(400).json({ msg: "viewer not found" });
  }
});

// Create viewer
router.post("/", async (req, res) => {
  const newViewer = {
    username: req.body.username,
    userId: req.body.userId,
    lastVoteDate: req.body.lastVoteDate,
    lastWatchDate: req.body.lastWatchDate,
  };

  if (!newViewer.name || !newViewer.userId) {
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
router.put("/:userId", async (req, res) => {
  const viewer = await Viewer.findAll({
    where: {
      userId: req.params.userId,
    },
  }).catch(errHandler);

  if (viewer && Viewer.length > 0) {
    const updViewer = req.body;
    const result = await Viewer.update(
      {
        lastVoteDate: updViewer.lastVoteDate
          ? updViewer.lastVoteDate
          : viewer[0].lastVoteDate,
        lastWatchDate: updViewer.lastWatchDate
          ? updViewer.lastWatchDate
          : viewer[0].lastWatchDate,
      },
      {
        where: {
          userId: req.params.userId,
        },
      }
    ).catch(errHandler);

    res.json({ msg: "viewer updated", updViewer });
  } else {
    res.status(400).json({ msg: "viewer not found" });
  }
});

// Helpers
const errHandler = (err) => {
  console.log("Error: ", err);
};

module.exports = router;
