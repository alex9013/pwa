// src/app.js
import express from "express";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import taskRoutes from path.join(__dirname, "routes/task.routes.js");
import authRoutes from path.join(__dirname, "routes/auth.routes.js");

import { connectToDB } from "./db/connect.js";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      process.env.FRONT_ORIGIN || ""
    ].filter(Boolean),
    credentials: true
  })
);
app.use(express.json());
app.use(morgan("dev"));

// Conexión a Mongo cacheada por request (seguro en serverless)
app.use(async (_req, _res, next) => {
  try { await connectToDB(); next(); } catch (e) { next(e); }
});

app.get("/", (_req, res) => res.json({ ok: true, name: "todo-pwa-api" }));
app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);

export default app;
