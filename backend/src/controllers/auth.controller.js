import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendResponse } from "../utils/response.js";

const TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

// Computed per request: process.env is only fully populated once config/env.js
// has run, and reading it lazily avoids importing this module too early.
export const cookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    maxAge: TOKEN_MAX_AGE
  };
};

export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const exists = await User.findOne({ email });

    if (exists) {
      return sendResponse(res, 400, "User already exists");
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashed
    });

    sendResponse(res, 201, "User registered", {
      id: user._id,
      email: user.email
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return sendResponse(res, 400, "Invalid credentials");
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return sendResponse(res, 400, "Invalid credentials");
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, cookieOptions());

    sendResponse(res, 200, "Login successful", {
      id: user._id,
      email: user.email
    });
  } catch (error) {
    next(error);
  }
};

export const logout = (req, res) => {
  const { maxAge, ...clearOptions } = cookieOptions();

  res.clearCookie("token", clearOptions);
  sendResponse(res, 200, "Logged out");
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    sendResponse(res, 200, "User fetched", user);
  } catch (error) {
    next(error);
  }
};