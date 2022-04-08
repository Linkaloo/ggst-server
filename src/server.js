import express from "express";
import characters from "./api/route";

const app = express();

app.use(express.json());
app.use(express.raw({ // Need raw message body for signature verification
  type: "application/json",
}));

app.use("/api/v1", characters);
app.use("*", (req, res) => {
  res.status(404).json({ error: "not found" });
});

export default app;
