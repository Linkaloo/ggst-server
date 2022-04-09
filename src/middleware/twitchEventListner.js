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

function verifySignature(messageSignature, messageID, messageTimestamp, body) {
  const message = messageID + messageTimestamp + body;
  const signature = crypto.createHmac("sha256", "keepItSecretKeepItSafe").update(message); // Remember to use the same secret set at creation
  const expectedSignatureHeader = `sha256=${signature.digest("hex")}`;
  console.log(expectedSignatureHeader);
  console.log(messageSignature);
  return expectedSignatureHeader === messageSignature;
}

const verify = (req, res) => {
  console.log("verify");
  if (!verifySignature(
    req.header("Twitch-Eventsub-Message-Signature"),
    req.header("Twitch-Eventsub-Message-Id"),
    req.header("Twitch-Eventsub-Message-Timestamp"),
    req.rawBody,
  )) {
    console.log("invalid signature");
    res.status(403).send("Forbidden"); // Reject requests with invalid signatures
  } else if (req.header("Twitch-Eventsub-Message-Type") === "webhook_callback_verification") {
    console.log(req.body.challenge);
    res.send(req.body.challenge); // Returning a 200 status with the received challenge to complete webhook creation flow
  } else if (req.header("Twitch-Eventsub-Message-Type") === "notification") {
    console.log(req.body.event); // Implement your own use case with the event data at this block
    res.send(""); // Default .send is a 200 status
  }
};

export default verify;
