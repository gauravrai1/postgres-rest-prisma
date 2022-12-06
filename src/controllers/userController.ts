import { NextFunction, Request, Response, Router } from "express";
import { HttpError } from "http-errors";
import { verifyToken } from "../middlewares/jwtMiddlewares";
import { getUserDetails, updateFirstName, updateLastName } from "../services/userServices";

// declare the router
const router = Router();

// routes
router.get("/user/details", verifyToken, getUserDetails);
router.get("/user/update/lastname", verifyToken, updateLastName);
router.get("/user/update/firstname", verifyToken, updateFirstName);

// user error handler
router.use(
  (err: HttpError, req: Request, res: Response, next: NextFunction) => {
    console.log({ ...err, status: err.status, message: err.message });

    // incoming vs default
    let message = err.message || "Something went wrong.";
    let status = err.status || 500;

    // special cases

    // remove message if status is 500
    if (status === 500) {
      message = "Something went wrong.";
    }

    res.status(status).json({ message });
  }
);

// export
export default router;
