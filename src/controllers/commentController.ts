import { NextFunction, Request, Response, Router } from "express";
import { HttpError } from "http-errors";
import { verifyToken } from "../middlewares/jwtMiddlewares";
import { getCommentById, getCommentByPostId, getCommentReplies, createComment, updateComment, deleteComment } from "../services/commentServices";

// declare the router
const router = Router();

// routes
router.get("/comment/:commentID", verifyToken, getCommentById);
router.get("/comment/post/:postID", verifyToken, getCommentByPostId);
router.get("/comment/replies/:commentID", verifyToken, getCommentReplies);
router.post("/comment", verifyToken, createComment);
router.put("/comment/update/:commentID", verifyToken, updateComment);
router.delete("/comment/delete/:commentID", verifyToken, deleteComment);


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
