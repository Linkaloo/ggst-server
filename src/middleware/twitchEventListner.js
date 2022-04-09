import crypto from "crypto";
import Axios from "axios";
import { application } from "express";
import { authenticate } from "./twitchAuth.js";

// Notification request headers
const TWITCH_MESSAGE_ID = "Twitch-Eventsub-Message-Id".toLowerCase();
const TWITCH_MESSAGE_TIMESTAMP = "Twitch-Eventsub-Message-Timestamp".toLowerCase();
const TWITCH_MESSAGE_SIGNATURE = "Twitch-Eventsub-Message-Signature".toLowerCase();
const MESSAGE_TYPE = "Twitch-Eventsub-Message-Type".toLowerCase();

// Notification message types
const MESSAGE_TYPE_VERIFICATION = "webhook_callback_verification";
const MESSAGE_TYPE_NOTIFICATION = "notification";
const MESSAGE_TYPE_REVOCATION = "revocation";

// Prepend this string to the HMAC that's created from the message
const HMAC_PREFIX = "sha256=";

const getSecret = () => {
  // TODO: Get your secret from secure storage. This is the secret you passed
  // when you subscribed to the event.
  const secret = "this is some secret";
  return "lf2dgfGAMERS";
};

// Build the message used to get the HMAC.
function getHmacMessage(request) {
  const bodyStr = request.body.toString();
  console.log(bodyStr);
  console.log(request.body);

  return (request.headers[TWITCH_MESSAGE_ID]
        + request.headers[TWITCH_MESSAGE_TIMESTAMP]
        + request.body.toString());
}

// Get the HMAC.
function getHmac(secret, message) {
  return crypto.createHmac("sha256", secret)
    .update(message)
    .digest("hex");
}

// Verify whether your signature matches Twitch's signature.
function verifyMessage(hmac, verifySignature) {
  return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(verifySignature));
}

const listener = async (req, res) => {
  console.log("eventSub");

  const secret = getSecret();
  const message = getHmacMessage(req);
  const hmac = HMAC_PREFIX + getHmac(secret, message);

  if (verifyMessage(hmac, req.headers[TWITCH_MESSAGE_SIGNATURE]) === true) {
    console.log("signatures match");

    // Get JSON object from body, so you can process the message.
    const notification = JSON.parse(req.body);

    if (MESSAGE_TYPE_NOTIFICATION === req.headers[MESSAGE_TYPE]) {
      // TODO: Do something with the event's data.

      console.log(`Event type: ${notification.subscription.type}`);
      console.log(JSON.stringify(notification.event, null, 4));

      res.sendStatus(204);
    } else if (MESSAGE_TYPE_VERIFICATION === req.headers[MESSAGE_TYPE]) {
      res.status(200).send(notification.challenge);
    } else if (MESSAGE_TYPE_REVOCATION === req.headers[MESSAGE_TYPE]) {
      res.sendStatus(204);

      console.log(`${notification.subscription.type} notifications revoked!`);
      console.log(`reason: ${notification.subscription.status}`);
      console.log(`condition: ${JSON.stringify(notification.subscription.condition, null, 4)}`);
    } else {
      res.sendStatus(204);
      console.log(`Unknown message type: ${req.headers[MESSAGE_TYPE]}`);
    }
  } else {
    console.log("403"); // Signatures didn't match.
    res.sendStatus(403);
  }
};

const verify = (req, res, buf) => {
  console.log("verify");
  // is there a hub to verify against
  req.twitch_eventsub = false;
  if (req.headers && req.headers.hasOwnProperty("twitch-eventsub-message-signature")) {
    req.twitch_eventsub = true;

    // id for dedupe
    const id = req.headers["twitch-eventsub-message-id"];
    // check age
    const timestamp = req.headers["twitch-eventsub-message-timestamp"];
    // extract algo and signature for comparison
    const [algo, signature] = req.headers["twitch-eventsub-message-signature"].split("=");

    // you could do
    // req.twitch_hex = crypto.createHmac(algo, config.hook_secret)
    // but we know Twitch should always use sha256
    req.twitch_hex = crypto.createHmac("sha256", "lf2dgfGAMERS")
      .update(id + timestamp + buf)
      .digest("hex");
    req.twitch_signature = signature;

    if (req.twitch_signature !== req.twitch_hex) {
      console.error("Signature Mismatch");
      res.sendStatus(403);
    } else {
      console.log("Signature OK");
      res.sendStatus(204);
    }

    // as an API style/EventSub handler
    // force set a/ensure a correct content type header
    // for all event sub routes
    // res.set("Content-Type", "text/plain");
  }
};

export default verify;
