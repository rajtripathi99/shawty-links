import crypto from "crypto";
import Link from "../models/link.model.js";

export const generateShortCode = async () => {
  const maxRetries = 5;

  for (let i = 0; i < maxRetries; i++) {
    const shortCode = crypto.randomBytes(4).toString("base64url").substring(0, 6);

    const exists = await Link.findOne({ shortCode });

    if (!exists) {
      return shortCode;
    }
  }

  throw new Error("Failed to generate unique short code");
};