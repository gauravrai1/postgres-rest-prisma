import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import prisma from "../lib/Prisma";
import { Prisma } from '@prisma/client'

export const getCommentById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {

        // get the comment id from the request
        const { commentID } = req.params;

        // get comment details
        const comment = await prisma.comment.findUnique({
            where: { id: Number(commentID) },
            select: {
                id: true,
                content: true,
            }
        });

        // if comment does not exist
        if (!comment) {
            next(createHttpError(400, { message: "Comment does not exist." }));
            return;
        }

        // return the comment
        res.status(200).json({ data: comment });
        return;
    } catch (err) {
        next(err);
    }
};

export const getCommentByPostId = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {

        // get the post id from the request
        const { postID } = req.params;

        // get comment details
        const comments = await prisma.comment.findMany({
            where: { postId: Number(postID) },
            select: {
                id: true,
                content: true,
            }
        });

        // return the comment
        res.status(200).json({ data: comments });
        return;
    } catch (err) {
        next(err);
    }
};

export const getCommentReplies = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {

        // get the comment id from the request
        const { commentID } = req.params;

        // get comment details
        const replies = await prisma.comment.findMany({
            where: { replytoId: Number(commentID) },
            select: {
                id: true,
                content: true,
            }
        });

        // return the comment
        res.status(200).json({ data: replies });
        return;
    } catch (err) {
        next(err);
    }
}

export const createComment = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {

        // get the user id and content from the request
        const { userID } = res.locals;
        const { content, postID, replytoId } = req.body;

        //fetch post
        const post = await prisma.post.findUnique({
            where: { id: postID },
            select: {
                id: true,
            }
        });

        // if post does not exist
        if (!post) {
            next(createHttpError(400, { message: "Post does not exist." }));
            return;
        }

        if (replytoId) {
            //fetch comment
            const commentReply = await prisma.comment.findUnique({
                where: { id: replytoId },
                select: {
                    id: true,
                }
            });

            // if comment does not exist
            if (!commentReply) {
                next(createHttpError(400, { message: "Comment does not exist." }));
                return;
            }

            // create the comment
            const comment = await prisma.comment.create({
                data: {
                    author: {
                        connect: { id: Number(userID) },
                    },
                    content: content || undefined,
                    post: {
                        connect: { id: postID },
                    },
                    replyto: {
                        connect: { id: replytoId },
                    }
                },
            });

            // return the comment
            res.status(200).json({ data: comment });

        } else {
            // create the comment
            const comment = await prisma.comment.create({
                data: {
                    author: {
                        connect: { id: Number(userID) },
                    },
                    content: content || undefined,
                    post: {
                        connect: { id: postID },
                    },
                },
            });
            
            // return the comment
            res.status(200).json({ data: comment });

        }

    } catch (err) {
        next(err);
    }
};

export const updateComment = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {

        // get the user id and content from the request
        const { userID } = res.locals;
        const { content } = req.body;

        // get the comment id from the request
        const { commentID } = req.params;

        // get comment details
        const comment = await prisma.comment.findUnique({
            where: { id: Number(commentID) },
            select: {
                id: true,
                content: true,
                authorId: true,
            }
        });

        // if comment does not exist
        if (!comment) {
            next(createHttpError(400, { message: "Comment does not exist." }));
            return;
        }

        // if comment is of the user
        if (comment.authorId !== userID) {
            next(createHttpError(400, { message: "You are not the author of this comment." }));
            return;
        }

        // update the comment
        const updatedComment = await prisma.comment.update({
            where: { id: Number(commentID) },
            data: {
                content: content || undefined,
            },
        });

        // return the comment
        res.status(200).json({ data: updatedComment });
        return;
    } catch (err) {
        next(err);
    }
}

export const deleteComment = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {

        // get the user id and content from the request
        const { userID } = res.locals;

        // get the comment id from the request
        const { commentID } = req.params;

        // get comment details
        const comment = await prisma.comment.findUnique({
            where: { id: Number(commentID) },
            select: {
                id: true,
                content: true,
                authorId: true,
            }
        });

        // if comment does not exist
        if (!comment) {
            next(createHttpError(400, { message: "Comment does not exist." }));
            return;
        }

        // if comment is of the user
        if (comment.authorId !== userID) {
            next(createHttpError(400, { message: "You are not the author of this comment." }));
            return;
        }

        // delete the comment
        const deletedComment = await prisma.comment.delete({
            where: { id: Number(commentID) },
        });

        // return the comment
        res.status(200).json({ data: deletedComment });
        return;
    } catch (err) {
        next(err);
    }
}
