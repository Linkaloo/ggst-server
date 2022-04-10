import express from "express";
import routes from "./api/route.js";

const app = express();
app.use(express.json());

app.use("/api/v1", routes);
app.use("*", (req, res) => {
  res.status(404).json({ error: "not found" });
});

export default app;
