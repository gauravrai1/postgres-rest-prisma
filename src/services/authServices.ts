import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import Prisma from "../lib/Prisma";
import { validateEmailPassword } from "../utils/authUtils";
import { generateAccessToken } from "../utils/jwtUtils";

// register user
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, comfirmPassword, firstName, lastName } = req.body;

    // check for empty fields
    if (!email || !password || !comfirmPassword) {
      next(createError(400, { message: "Please enter the required fields." }));
      return;
    }

    // validations
    const isEmailPassword = validateEmailPassword(email, password);

    if (!isEmailPassword.success) {
      next(createError(400, isEmailPassword.message));
      return;
    }

    // generate hash password
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    // create user
    const user = await Prisma.user.create({
      data: { 
        firstName: firstName || undefined,
        email: email || undefined,
        lastName: lastName || undefined,
        password: hashPassword
      }
    });

    // generate tokens & send response
    res.status(201).json({
      message: "User registered successfully.",
      data: {
        id: user.id,
        token: generateAccessToken(user.email, user.id)
      }
    });
    return;
  } catch (err) {
    next(err);
  }
};

// login user
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    // check for empty fields
    if (!email || !password) {
      next(createError(400, { message: "Please enter the required fields." }));
      return;
    }

    const user = await Prisma.user.findUnique({ where: { email } });

    if (!user) {
      next(createError(400, { message: "User does not exist." }));
      return;
    }

    // compare passwords
    if (await bcrypt.compare(password, user.password)) {
      // generate tokens & send response
      res.status(200).json({
        message: "Successfully logged in.",
        data: {
          accessToken: generateAccessToken(user.email, user.id)
        }
      });
      return;
    } else {
      next(createError(400, { message: "Incorrect password." }));
      return;
    }
  } catch (err) {
    next(err);
  }
};
