import jwt from "jsonwebtoken";
import { sendResponse } from "../utils/response.js";

export const protect = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return sendResponse(res, 401, "Unauthorized");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    return sendResponse(res, 401, "Invalid token");
  }
};