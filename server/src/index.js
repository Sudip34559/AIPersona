import connectDB from "./db/index.js";
import { app } from "./app.js";
import "dotenv/config";
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8800, () => {
      console.log(` listening on http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("mongodb connection failed: " + err);
  });
