import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import linkRoutes from "./routes/link.routes.js";
import { redirectLink } from "./controllers/link.controller.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { sendResponse } from "./utils/response.js";

dotenv.config();

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

app.get("/:shortCode", redirectLink);

app.use((req, res) => {
  sendResponse(res, 404, "Route not found");
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}.`);
  });
});