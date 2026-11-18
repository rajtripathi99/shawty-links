import "./config/env.js";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import linkRoutes from "./routes/link.routes.js";
import { redirectLink } from "./controllers/link.controller.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { sendResponse } from "./utils/response.js";

const app = express();

app.use(express.json());

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.use(helmet());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/links", linkRoutes);

const DB_STATES = ["disconnected", "connected", "connecting", "disconnecting"];

// Public liveness/readiness probe. Also handy as a keep-alive ping so hosting
// free tiers (Render) don't spin the instance down between logins.
app.get("/api/health", (req, res) => {
  const dbState = DB_STATES[mongoose.connection.readyState] || "unknown";
  const healthy = mongoose.connection.readyState === 1;

  sendResponse(res, healthy ? 200 : 503, healthy ? "OK" : "Degraded", {
    status: healthy ? "ok" : "degraded",
    db: dbState,
    uptime: Math.round(process.uptime()),
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString()
  });
});

app.get("/:shortCode", redirectLink);

app.use((req, res) => {
  sendResponse(res, 404, "Route not found");
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Listen first so health checks respond immediately, then connect in the
// background: the host can see the instance is up while MongoDB is still
// dialing, instead of the process dying on a slow/failed initial connection.
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`);
});

connectDB().catch(() => {
  console.error("Running without a database connection; /api/health will report 503.");
});