const express = require("express");
const router = express.Router();
const Viewer = require("../../models/Viewer");

// Get all viewers
router.get("/", async (req, res) => {
  const viewers = await Viewer.findAll({
    attributes: ["id", "username", "lastVoteDate", "lastWatchDate"],
  }).catch(errHandler);
  res.json(viewers);
});

// Get single viewer
router.get("/:id", async (req, res) => {
  const viewer = await Viewer.findAll({
    where: {
      id: req.params.id,
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
    name: req.body.name,
    email: req.body.email,
  };

  if (!newViewer.name || !newViewer.email) {
    return res.status(400).json({ msg: "Please include a name and email" });
  }

  const viewer = await Viewer.create(newViewer).catch(errHandler);

  if (viewer) {
    res.json(viewer);
  } else {
    res.status(500).json({ msg: "internal db error occoured" });
  }
});

// Update viewer
router.put("/:id", async (req, res) => {
  const viewer = await Viewer.findAll({
    where: {
      id: req.params.id,
    },
  }).catch(errHandler);

  if (viewer && Viewer.length > 0) {
    const updViewer = req.body;
    const result = await Viewer.update(
      {
        name: updViewer.name ? updViewer.name : viewer[0].name,
        email: updViewer.email ? updViewer.email : viewer[0].email,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    ).catch(errHandler);

    res.json({ msg: "viewer updated", updViewer });
  } else {
    res.status(400).json({ msg: "viewer not found" });
  }
});

// Delete Member
router.delete("/:id", async (req, res) => {
  const viewer = await Viewer.findAll({
    where: {
      id: req.params.id,
    },
  }).catch(errHandler);

  if (viewer && Viewer.length > 0) {
    const viewer = Viewer.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.json({
      msg: "Member deleted",
      viewer,
    });
  } else {
    res.status(400).json({ msg: "viewer not found" });
  }
});

// Get all viewers with pagination
router.get("/:page/:pageSize", async (req, res) => {
  const page = parseInt(req.params.page);
  const pageSize = parseInt(req.params.pageSize);

  const viewers = await Viewer.findAll({
    attributes: ["id", "name", "email"],
    ...paginate({ page, pageSize }),
  }).catch(errHandler);

  res.json(viewers);
});

// Helpers
const errHandler = (err) => {
  console.log("Error: ", err);
};

const paginate = ({ page, pageSize }) => {
  const offset = page * pageSize;
  const limit = pageSize;

  return {
    offset,
    limit,
  };
};

module.exports = router;
