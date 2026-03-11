import { sendResponse } from "../utils/response.js";

export const errorHandler = (err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === "production"
    ? "Server error"
    : err.message || "Server error";

  sendResponse(res, statusCode, message);
};