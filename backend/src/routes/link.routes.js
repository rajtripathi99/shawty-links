import express from "express";
import { createLink, getUserLinks, getLinkByCode } from "../controllers/link.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { createLinkLimiter } from "../middleware/rateLimit.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createLinkSchema } from "../utils/validationSchemas.js";

const router = express.Router();

router.post("/", protect, createLinkLimiter, validate(createLinkSchema), createLink);
router.get("/my", protect, getUserLinks);
router.get("/:shortCode", getLinkByCode);

export default router;
