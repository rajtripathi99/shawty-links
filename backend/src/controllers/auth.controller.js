import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendResponse } from "../utils/response.js";

const cookieOptions = {
  httpOnly: true,
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  secure: process.env.NODE_ENV === "production"
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

    res.cookie("token", token, cookieOptions);

    sendResponse(res, 200, "Login successful", {
      id: user._id,
      email: user.email
    });
  } catch (error) {
    next(error);
  }
};

export const logout = (req, res) => {
  res.clearCookie("token");
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