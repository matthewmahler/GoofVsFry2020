const express = require("express");
const fetch = require("isomorphic-fetch");
const Viewer = require("../../models/Viewer");

const router = express.Router();

router.get("/", async (req, res) => {
  const url = "http://tmi.twitch.tv/group/user/goofinabout/chatters";
  const response = await fetch(url);
  const {
    chatters: {
      broadcaster,
      moderators,
      vips,
      staff,
      admins,
      global_mods,
      viewers,
    },
  } = await response.json();
  const viewerList = broadcaster.concat(
    moderators,
    vips,
    staff,
    admins,
    global_mods,
    viewers
  );

  // schedule timer
  // get all the viewers in the DB
  const allViewers = await Viewer.findAll({
    attributes: ["username"],
  }).catch(errHandler);

  // filter newViewerList
  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  const newViewerList = allViewers.concat(viewerList).filter(onlyUnique);

  newViewerList.forEach(async (n) => {
    const newViewer = {
      username: n,
      lastVoteDate: null,
      lastWatchDate: new Date().toISOString(),
      canVote: true,
    };

    const createdViewer = await Viewer.create(newViewer).catch(errHandler);
  });
  res.json({ msg: "Done" });
});

const errHandler = (err) => {
  console.log("Error: ", err);
};

module.exports = router;
