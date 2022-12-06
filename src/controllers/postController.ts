import { NextFunction, Request, Response, Router } from "express";
import { HttpError } from "http-errors";
import { verifyToken } from "../middlewares/jwtMiddlewares";
import { createDraft, getPostById, getPostsByUserId, getDraftsByUserId, feed, togglePublish, updatePost, deletePost } from "../services/postServices";

// declare the router
const router = Router();

// routes
router.post("/post", verifyToken, createDraft);
router.get("/post/:postID", verifyToken, getPostById);
router.get("/post/user/:userID", verifyToken, getPostsByUserId);
router.get("/post/drafts/:userID", verifyToken, getDraftsByUserId);
router.get("/post/feed", verifyToken, feed);
router.put("/post/publish/:postID", verifyToken, togglePublish);
router.put("/post/update/:postID", verifyToken, updatePost);
router.delete("/post/delete/:postID", verifyToken, deletePost);

// auth error handler for general use cases
router.use(
  (err: HttpError, req: Request, res: Response, next: NextFunction) => {
    console.log({ ...err, status: err.status, message: err.message });

    // incoming vs default
    let message = err.message || "Something went wrong.";
    let status = err.status || 500;

    // remove message if status is 500
    if (status === 500) {
      message = "Something went wrong.";
    }

    res.status(status).json({ message });
  }
);

// export
export default router;
