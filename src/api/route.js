import express from "express";
import Axios from "axios";
import characterCtrl from "./character.controller.js";
import playerCtrl from "./player.controller.js";
import attackCtrl from "./attack.controller.js";
import { authenticate } from "../utils/twitchAuth.js";

const router = express.Router();

// characters
router.route("/characters/").get(characterCtrl.apiGetCharacters);
router.route("/characters").post(characterCtrl.apiCreateCharacter);
router.route("/characters/:character").delete(characterCtrl.apiDeleteCharacter);
router.route("/characters").put(characterCtrl.apiUpdateCharacter);

// moves
router.route("/attacks").get(attackCtrl.apiGetAttacks);
router.route("/attacks/:character").get(attackCtrl.apiGetAttacks);
router.route("/attacks/all/:input").get(attackCtrl.apiGetAttacks);
router.route("/attacks").post(attackCtrl.apiCreateAttack);
router.route("/attacks/:character/:input").delete(attackCtrl.apiDeleteAttack);
router.route("/attacks").put(attackCtrl.apiUpdateAttack);

// players
router.route("/players/:guild").get(playerCtrl.apiGetPlayers);
router.route("/players/:guild/:character").get(playerCtrl.apiGetPlayers);
router.route("/players").post(playerCtrl.apiCreatePlayer);
router.route("/players").put(playerCtrl.apiUpdatePlayer);
router.route("/players/:guild/:player").delete(playerCtrl.apiDeletePlayer);
router.route("/players/:guild").delete(playerCtrl.apiDeletePlayer);

router.route("/twitch").get(async () => {
  const token = await authenticate();

  // const url = "https://api.twitch.tv/helix/games/top";

  // const game = await Axios({
  //   method: "GET",
  //   url,
  //   headers: {
  //     Authorization: `Bearer ${auth.access_token}`,
  //     "Client-id": clientId,
  //   },
});

router.route("/twitchevent").get(async (req, res) => {
  const token = authenticate();
  console.log(token);

  const listSub = await Axios({
    method: "GET",
    url: "https://api.twitch.tv/helix/eventsub/subscriptions",
    headers: {
      Authorization: `Bearer ${token.access_token}`,
      "Client-ID": process.env.TWITCH_CLIENTID,
    },
  });

  console.log(listSub);
  // const list = listSub.data.data;
  // list.forEach(async (element) => {
  //   await Axios({
  //     method: "DELETE",
  //     url: `https://api.twitch.tv/helix/eventsub/subscriptions?id=${element.id}`,
  //     headers: {
  //       Authorization: `Bearer ${token.access_token}`,
  //       "Client-ID": process.env.TWITCH_CLIENTID,
  //     },
  //   });
  // });

  // try {
  // const body = {
  //   version: 1,
  //   type: "channel.follow",
  //   condition: {
  //     broadcaster_user_id: "12826",
  //   },
  //   transport: {
  //     method: "webhook",
  //     callback: "https://ggst-server.herokuapp.com/api/v1/eventSub",
  //     secret: "abcdefghij0123456789",
  //   },
  // };

  //   const createSub = await Axios({
  //     method: "POST",
  //     url: "https://api.twitch.tv/helix/eventsub/subscriptions",
  //     headers: {
  //       Authorization: `Bearer ${token.access_token}`,
  //       "Client-ID": process.env.TWITCH_CLIENTID,
  //       "Content-Type": "application/json",
  //     },
  //     data: body,
  //   });

  //   console.log(createSub);
  // } catch (err) {
  //   console.log(err);
  // }
});

router.route("/streamOnline").get(async (req, res) => {
  console.log("some stream is online");
  console.log(req);
});

export default router;
