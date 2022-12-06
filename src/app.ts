import express from "express";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import cors from "cors";
import init from "./utils/primaService";
import authController from "./controllers/authController";
import userController from "./controllers/userController";
import postController from "./controllers/postController";
import commentController from "./controllers/commentController";
import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";

// init services
init()
  .then(msg => {
    console.log(msg);

    // init app
    const app = express();

    // add middlewares
    app.use(express.json());
    app.use(morgan("tiny"));

    // controllers
    app.use(authController);
    app.use(userController);
    app.use(postController);
    app.use(commentController);

    // basic route
    app.get("/", (req, res): void => {
      res.status(200).json({ msg: `Server is running` });
    });

    // 404 api
    app.use((req, res) => {
      res.status(404).json({ msg: "Page not found" });
    });

    // Cors
    app.use(cors());

    // Apply the rate limiting middleware to all requests
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
      standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
      legacyHeaders: false, // Disable the `X-RateLimit-*` headers
      message: (req: Request, res: Response) => {
        res
          .status(StatusCodes.TOO_MANY_REQUESTS)
          .json({ message: "You can only make 100 requests every 15 Minutes" });
      },
    });
    app.use(limiter);

    const PORT = process.env.PORT || 4000

    app.listen(PORT, () => console.log("Server started on port " + PORT));
  })
  .catch(err => console.log(err));
