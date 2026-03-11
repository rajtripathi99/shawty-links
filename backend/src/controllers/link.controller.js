import Link from "../models/link.model.js";
import { generateShortCode } from "../utils/generateShortCode.js";
import { generateQRCode } from "../utils/qrCode.js";
import { sendResponse } from "../utils/response.js";

export const createLink = async (req, res, next) => {
  try {
    const { url } = req.body;

    const shortCode = await generateShortCode();

    const shortUrl = `${process.env.FRONTEND_URL}/${shortCode}`;

    const qr = await generateQRCode(shortUrl);

    const link = await Link.create({
      originalUrl: url,
      shortCode,
      userId: req.user.userId
    });

    sendResponse(res, 201, "Link created", {
      ...link.toObject(),
      shortUrl,
      qrCode: qr
    });
  } catch (error) {
    next(error);
  }
};

export const getUserLinks = async (req, res, next) => {
  try {
    const links = await Link.find({
      userId: req.user.userId
    }).sort({ createdAt: -1 });

    const linksWithQr = await Promise.all(
      links.map(async (link) => {
        const shortUrl = `${process.env.FRONTEND_URL}/${link.shortCode}`;
        const qrCode = await generateQRCode(shortUrl);
        return { ...link.toObject(), shortUrl, qrCode };
      })
    );

    sendResponse(res, 200, "Links fetched", linksWithQr);
  } catch (error) {
    next(error);
  }
};

export const redirectLink = async (req, res, next) => {
  try {
    const { shortCode } = req.params;

    const link = await Link.findOne({ shortCode });

    if (!link) {
      if (req.accepts('json')) {
        return sendResponse(res, 404, "Link not found");
      }
      return res.status(404).json({ success: false, message: "Link not found" });
    }

    link.clicks += 1;
    link.lastVisited = new Date();

    await link.save();

    // If the frontend is requesting this via API, send back the URL
    if (req.xhr || req.headers.accept?.includes('json')) {
      return sendResponse(res, 200, "Link found", { originalUrl: link.originalUrl });
    }

    // Direct browser visit
    res.redirect(link.originalUrl);
  } catch (error) {
    next(error);
  }
};