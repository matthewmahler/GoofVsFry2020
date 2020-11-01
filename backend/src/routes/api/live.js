const express = require("express");
const fetch = require("isomorphic-fetch");
const cron = require("node-cron");
const dotenv = require("dotenv");
const moment = require("moment-timezone");

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
  "*/2 * * * *",
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
  const auth = `https://id.twitch.tv/oauth2/token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=client_credentials`;
  const options = {
    method: "POST",
  };

  const authRes = await fetch(auth, options).catch(errHandler);
  const authJSON = await authRes.json();

  const response = await fetch(
    "https://api.twitch.tv/helix/search/channels?query=goofinabout",
    {
      headers: {
        Authorization: `Bearer ${authJSON.access_token}`,
        "Client-Id": process.env.CLIENT_ID,
      },
    }
  ).catch(errHandler);
  const json = await response.json();
  console.log(await json);
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
  const today = moment().tz("America/New_York").format("YYYY-MM-DD");

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
      const lastWatchDate = moment(viewer.lastWatchDate).format("YYYY-MM-DD");

      if (today !== lastWatchDate) {
        viewer.lastWatchDate = today;
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

module.exports = router;
