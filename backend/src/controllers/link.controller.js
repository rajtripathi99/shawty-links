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
      userId: req.user.userId,
      qrCode: qr
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

        // Reuse the stored QR code; only generate (and persist) for links
        // created before the field existed.
        if (!link.qrCode) {
          link.qrCode = await generateQRCode(shortUrl);
          await link.save();
        }

        return { ...link.toObject(), shortUrl };
      })
    );

    sendResponse(res, 200, "Links fetched", linksWithQr);
  } catch (error) {
    next(error);
  }
};

const findAndTrack = async (shortCode) => {
  const link = await Link.findOne({ shortCode });

  if (!link) {
    return null;
  }

  link.clicks += 1;
  link.lastVisited = new Date();

  await link.save();

  return link;
};

// JSON resolver used by the SPA redirect page. Kept separate from redirectLink
// so fetch() never has to follow a 302 to a third-party origin.
export const getLinkByCode = async (req, res, next) => {
  try {
    const link = await findAndTrack(req.params.shortCode);

    if (!link) {
      return sendResponse(res, 404, "Link not found");
    }

    sendResponse(res, 200, "Link found", { originalUrl: link.originalUrl });
  } catch (error) {
    next(error);
  }
};

export const redirectLink = async (req, res, next) => {
  try {
    const link = await findAndTrack(req.params.shortCode);

    if (!link) {
      return sendResponse(res, 404, "Link not found");
    }

    // Direct browser visit: let the browser follow the redirect natively.
    res.redirect(link.originalUrl);
  } catch (error) {
    next(error);
  }
};
