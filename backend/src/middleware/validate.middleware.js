import { sendResponse } from "../utils/response.js";

export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const message = result.error.issues[0].message;
    return sendResponse(res, 400, message);
  }

  req.body = result.data;
  next();
};
