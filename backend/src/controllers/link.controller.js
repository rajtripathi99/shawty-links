import Link from "../models/link.model.js";
import { generateShortCode } from "../utils/generateShortCode.js";
import { generateQRCode } from "../utils/qrCode.js";
import { sendResponse } from "../utils/response.js";

export const createLink = async (req, res, next) => {
  try {
    const { url } = req.body;

    const shortCode = await generateShortCode();

    const shortUrl = `${process.env.BASE_URL}/${shortCode}`;

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
        const shortUrl = `${process.env.BASE_URL}/${link.shortCode}`;
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
      return sendResponse(res, 404, "Link not found");
    }

    link.clicks += 1;
    link.lastVisited = new Date();

    await link.save();

    res.redirect(link.originalUrl);
  } catch (error) {
    next(error);
  }
};