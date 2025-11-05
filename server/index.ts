import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleGetStats, handlePostResult, handleDeleteStats } from "./routes/stats";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Stats endpoints for SQLite-backed storage
  app.get("/api/stats", handleGetStats);
  app.post("/api/stats", handlePostResult);
  app.delete("/api/stats", handleDeleteStats);

  return app;
}
