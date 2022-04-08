import dotenv from "dotenv";
import app from "./src/server";

dotenv.config();

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
