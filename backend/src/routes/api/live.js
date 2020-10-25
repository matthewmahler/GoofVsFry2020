const express = require("express");
const fetch = require("isomorphic-fetch");
const cron = require("node-cron");
const dotenv = require("dotenv");

dotenv.config();

const Viewer = require("../../models/Viewer");

const router = express.Router();

router.get("/", async (req, res) => {
  console.log("GOOF IS LIVE NOW");
  ping.start();
  res.json({ msg: "Ping started" });
});

const ping = cron.schedule(
  "*/10 * * * *",
  async () => {
    let isLive = await checkIfLive();
    console.log(`Is Live: ${isLive}`);
    if (isLive) {
      addNewViewers();
    }
    console.log("PINGING STREAM EVERY 10 MINUTES");
  },
  { scheduled: false }
);

const checkIfLive = async () => {
  const response = await fetch(
    "https://api.twitch.tv/helix/search/channels?query=goofinabout&live_only=true",
    {
      headers: {
        Authorization: "Bearer ann8c37jimqqggiq59av05iiz1sm4s",
        "Client-Id": process.env.CLIENT_ID,
      },
    }
  );
  const json = await response.json();
  return json.data[0].is_live;
};

const addNewViewers = async () => {
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
  const allViewersObject = await Viewer.findAll({
    attributes: ["username"],
  }).catch(errHandler);

  const allViewers = allViewersObject.map((v) => v.dataValues.username);

  viewerList.forEach(async (u) => {
    const viewer = await Viewer.findOne({
      where: {
        username: u,
      },
    }).catch(errHandler);

    if (viewer) {
      const today = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate()
      );
      const lastWatchDate = new Date(
        new Date(viewer.lastWatchDate).getFullYear(),
        new Date(viewer.lastWatchDate).getMonth(),
        new Date(viewer.lastWatchDate).getDate()
      );

      if (today.getTime() !== lastWatchDate.getTime()) {
        viewer.lastWatchDate = today;
        viewer.canVote = true;
        console.log(`updated: ${u}`);
      }

      const result = await viewer.save().catch(errHandler);
    }
  });
  const newViewerList = viewerList.filter((e) => !allViewers.includes(e));
  newViewerList.forEach(async (n) => {
    const newViewer = {
      username: n,
      lastVoteDate: null,
      lastWatchDate: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate()
      ),
      canVote: true,
    };
    const createdViewer = await Viewer.create(newViewer).catch(errHandler);
    console.log(`created: ${n}`);
  });
};

const errHandler = (err) => {
  console.log("Error: ", err);
};

module.exports = router;
