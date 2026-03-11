import rateLimit from "express-rate-limit";

export const createLinkLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { success: false, message: "Too many links created. Try again later.", data: null }
});