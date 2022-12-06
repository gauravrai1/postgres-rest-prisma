import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { decodeToken } from "../utils/jwtUtils";
const SECRET_KEY = process.env.JWT_ACCESS_KEY;

// validate token
export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { authorization } = req.headers;

    // check for token
    if (!authorization) {
      next(createHttpError(401, { message: "Missing token." }));
      return;
    }

    // trim the token
    const token = authorization.replace("Bearer", "").trim();

    // verify token
    const payload = await decodeToken(token, SECRET_KEY!!);

    if (!payload) {
      next(createHttpError(403, { message: "Invalid token." }));
      return;
    }

    res.locals.userID = parseInt(payload.aud);
    next();
  } catch (err) {
    next(err);
  }
};
