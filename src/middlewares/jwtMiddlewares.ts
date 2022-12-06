import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { decodeToken } from "../utils/jwtUtils";

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
    const payload = await decodeToken(token);

    if (!payload) {
      next(createHttpError(403, { message: "Invalid token." }));
      return;
    }

    res.locals.userID = payload.aud;
    next();
  } catch (err) {
    next(err);
  }
};
