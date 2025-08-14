import express from "express";
import cors from "cors";
import OpenAI from "openai";
import "dotenv/config";
import { H_SYSTEM_PROMPT } from "./db/hitesh_systemPronpt.js";
import cookieParser from "cookie-parser";
// import { client } from "./service/client";
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

import aiRutes from "./routes/ai.routes.js";
import userRoutes from "./routes/user.routes.js";
app.use("/api/v1/ai", aiRutes);
app.use("/api/v1/user", userRoutes);

export { app };
