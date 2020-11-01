const express = require("express");
const fetch = require("isomorphic-fetch");
const cron = require("node-cron");
const dotenv = require("dotenv");

dotenv.config();

const Viewer = require("../../models/Viewer");

const router = express.Router();

router.get("/", async (req, res) => {
  console.log("--------------------------------------------------------");
  console.log("----------------GOOF IS LIVE NOW------------------------");
  console.log("--------------------------------------------------------");

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
      console.log("--------------------------------------------------------");
      console.log("PINGING STREAM EVERY 10 MINUTES");
      console.log("--------------------------------------------------------");
    } else {
      console.log("--------------------------------------------------------");
      console.log("GOOF IS NO LONGER LIVE, STOPPING PING");
      console.log("--------------------------------------------------------");

      ping.stop();
    }
  },
  { scheduled: false }
);

const checkIfLive = async () => {
  const response = await fetch(
    "https://api.twitch.tv/helix/search/channels?query=goofinabout&live_only=true",
    {
      headers: {
        Authorization: "Bearer prau3ol6mg5glgek8m89ec2s9q5i3i",
        "Client-Id": process.env.CLIENT_ID,
      },
    }
  ).catch(errHandler);
  const json = await response.json();
  console.log(json);
  return await json.data[0].is_live;
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
  const today = formatter.format(
    new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate()
    ).getTime()
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
      const lastWatchDate = formatter.format(
        new Date(
          new Date(viewer.lastWatchDate).getFullYear(),
          new Date(viewer.lastWatchDate).getMonth(),
          new Date(viewer.lastWatchDate).getDate()
        ).getTime()
      );

      if (today !== lastWatchDate) {
        viewer.lastWatchDate = today;
        viewer.canVote = true;
        console.log("-----------------------UPDATED VIEWER-------------------");
        console.log(viewer);
        console.log("--------------------------------------------------------");
      }

      const result = await viewer.save().catch(errHandler);
    }
  });
  const newViewerList = viewerList.filter((e) => !allViewers.includes(e));
  newViewerList.forEach(async (n) => {
    const newViewer = {
      username: n,
      lastVoteDate: null,
      lastWatchDate: today,
    };
    const createdViewer = await Viewer.create(newViewer).catch(errHandler);
    console.log("-----------------------CREATED VIEWER-------------------");
    console.log(newViewer);
    console.log("--------------------------------------------------------");
  });
};

const errHandler = (err) => {
  console.log("Error: ", err);
};

const formatter = new Intl.DateTimeFormat("en-us", {
  year: "numeric",
  month: "numeric",
  day: "numeric",
});
module.exports = router;
