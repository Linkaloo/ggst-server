import express from "express";
import characterCtrl from "./character.controller.js";
import playerCtrl from "./player.controller.js";
import attackCtrl from "./attack.controller.js";

const router = express.Router();

// characters
router.route("/characters/").get(characterCtrl.apiGetCharacters);
router.route("/characters").post(characterCtrl.apiCreateCharacter);
router.route("/characters/:character").delete(characterCtrl.apiDeleteCharacter);
router.route("/characters").put(characterCtrl.apiUpdateCharacter);

// moves
router.route("/attacks").get(attackCtrl.apiGetAttacks);
router.route("/attacks").post(attackCtrl.apiCreateAttack);
router.route("/attacks/:character/:input").delete(attackCtrl.apiDeleteAttack);
router.route("/attacks").put(attackCtrl.apiUpdateAttack);

// players
router.route("/players").get(playerCtrl.apiGetPlayers);
router.route("/players").post(playerCtrl.apiCreatePlayer);
router.route("/players").put(playerCtrl.apiUpdatePlayer);
router.route("/players").delete(playerCtrl.apiDeletePlayer);

export default router;
