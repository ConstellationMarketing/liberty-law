import express from "express";
import cors from "cors";
import { handleGoogleReviews } from "./routes/google-reviews";
import { handleHealthCheck } from "./routes/health-check";
import { handleSitemap } from "./routes/sitemap";

export function createPublicServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/api/ping", (_req, res) => {
    res.json({ message: process.env.PING_MESSAGE ?? "ping" });
  });
  app.get("/api/google-reviews", handleGoogleReviews);
  app.get("/api/health", handleHealthCheck);
  app.get("/sitemap.xml", handleSitemap);

  return app;
}
