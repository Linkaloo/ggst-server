import express from "express";
import bodyParser from "body-parser";
import routes from "./api/route.js";
import * as middleWare from "./middleware/index.js";

const app = express();

const rawBodySaver = function (req, res, buf, encoding) {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || "utf8");
  }
};

app.use(bodyParser.json({ verify: rawBodySaver }));
app.use(bodyParser.urlencoded({ verify: rawBodySaver, extended: true }));
app.use(bodyParser.raw({ verify: rawBodySaver, type: "*/*" }));

app.use(middleWare.signatureValidation);

app.use("/api/v1", routes);
app.use("*", (req, res) => {
  res.status(404).json({ error: "not found" });
});

export default app;
