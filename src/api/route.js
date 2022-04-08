import express from "express";
import jwt from "jsonwebtoken";
import { RefreshingAuthProvider, ClientCredentialsAuthProvider } from "@twurple/auth";
import { promises as fs } from "fs";
import { ApiClient } from "@twurple/api";
import Axios from "axios";
import characterCtrl from "./character.controller";
import playerCtrl from "./player.controller";
import attackCtrl from "./attack.controller";
import { authenticate } from "../middleware/twitchAuth";
import listener from "../middleware/twitchEventListner";

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

router.route("/eventsub").post(listener);
router.route("/twitch").get(async () => {
  const token = await authenticate();

  // using it
  //   const apiClient = new ApiClient({ authProvider });
  //   const user = await apiClient.users.getUserByName("btmc");

  //   const streams = await apiClient.streams.getStreamByUserId(user.id);
  //   const game = streams.title;
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

  //   const listSub = await Axios({
  //     method: "GET",
  //     url: "https://api.twitch.tv/helix/eventsub/subscriptions",
  //     headers: {
  //       Authorization: `Bearer ${token.access_token}`,
  //       "Client-ID": process.env.TWITCH_CLIENTID,
  //     },
  //   });

  try {
    const body = {
      version: 1,
      type: "channel.follow",
      condition: {
        broadcaster_user_id: "12826",
      },
      transport: {
        method: "webhook",
        callback: "https://example.com/webhooks/callback",
        secret: "abcdefghij0123456789",
      },
    };

    const createSub = await Axios({
      method: "POST",
      url: "https://api.twitch.tv/helix/eventsub/subscriptions",
      headers: {
        Authorization: `Bearer ${token.access_token}`,
        "Client-ID": process.env.TWITCH_CLIENTID,
        "Content-Type": "application/json",
      },
      data: body,
    });

    console.log(createSub.data);
  } catch (err) {
    console.log(err);
  }
});

export default router;
