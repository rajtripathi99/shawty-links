import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required")
});

export const createLinkSchema = z.object({
  url: z.string()
    .min(1, "URL is required")
    .transform((val) => {
      const trimmed = val.trim();

      if (/^https?:\/\//i.test(trimmed)) {
        return trimmed;
      }

      if (/^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/.test(trimmed)) {
        return `https://${trimmed}`;
      }

      return trimmed;
    })
    .pipe(z.string().url("Invalid URL"))
});