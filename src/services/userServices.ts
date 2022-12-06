import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import Prisma from "../lib/Prisma";

export const getUserDetailsById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    // get the user id from the request
    const userID = Number(req.params.userID);
    
    // get user details
    const user = await Prisma.user.findUnique({
      where: { id: Number(userID) },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });

    // if user does not exist
    if (!user) {
      next(createHttpError(400, { message: "User does not exist." }));
      return;
    }

    // return user details
    res.status(200).json({ data: user });
    return;
  } catch (err) {
    next(err);
  }
};

export const getUserDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // get the user id from the request
    const { userID } = res.locals;

    // get user details
    const user = await Prisma.user.findUnique({
      where: { id: userID },
      select: {
        email: true,
        id: true
      }
    });

    // if user does not exist
    if (!user) {
      next(createHttpError(400, { message: "User does not exist." }));
      return;
    }

    // return user details
    res.status(200).json({ data: user });
    return;
  } catch (err) {
    next(err);
  }
};

export const updateFirstName = async (
    req: Request,
    res: Response,
    next: NextFunction
    ) => {
    try {
        // get the user id and first name from the request
        const { userID } = res.locals;
        const { firstName } = req.body;

        // update the first name
        const user = await Prisma.user.update({
            where: { id: userID },
            data: {
                firstName: firstName || undefined,
            },
        });

        // check if user exists
        if (!user) {
            next(createHttpError(400, { message: "User does not exist." }));
            return;
        }

        // return user details
        res.status(200).json({ data: user });
        return;
    } catch (err) {
        next(err);
    }
};

export const updateLastName = async (
    req: Request,
    res: Response,
    next: NextFunction
    ) => {
    try {

        // get the user id and last name from the request
        const { userID } = res.locals;
        const { lastName } = req.body;

        // update the last name
        const user = await Prisma.user.update({
            where: { id: userID },
            data: {
                lastName: lastName || undefined,
            },
        });

        // check if user exists
        if (!user) {
            next(createHttpError(400, { message: "User does not exist." }));
            return;
        }

        // return user details
        res.status(200).json({ data: user });
        return;
    } catch (err) {
        next(err);
    }
};

