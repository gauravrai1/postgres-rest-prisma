import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import prisma from "../lib/Prisma";
import { Prisma } from '@prisma/client'

export const createDraft = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {

        // get the user id and content from the request
        const { userID } = res.locals;
        const { content, published } = req.body;

        // create the post
        const post = await prisma.post.create({
            data: {
                author: {
                    connect: { id: userID },
                },
                content: content || undefined,
                published: published || false,
            },
        });

        // return the post
        res.status(200).json({ data: post });
        return;
    } catch (err) {
        next(err);
    }
};

export const getPostById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {

        // get the post id from the request
        const postID = Number(req.params);

        // get post details
        const post = await prisma.post.findUnique({
            where: { id: postID },
            select: {
                id: true,
                content: true,
                comments: true
            }
        });

        // if post does not exist
        if (!post) {
            next(createHttpError(400, { message: "Post does not exist." }));
            return;
        }

        // return post details
        res.status(200).json({ data: post });
        return;
    } catch (err) {
        next(err);
    }
};

export const getPostsByUserId = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {

        // get the user id from the request
        const userID = Number(req.params);

        // get posts
        const posts = await prisma.user.findUnique({
          where: {
            id: userID
          },
        })
        .posts({
          where: {
            published: true,
          },
        })

        // return post details
        res.status(200).json({ data: posts });
        return;
    } catch (err) {
        next(err);
    }
}

export const getDraftsByUserId = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {

        // get the user id from the request
        const userID = Number(req.params);

        // get post details
        const posts = await prisma.user.findUnique({
            where: {
              id: userID
            },
          })
          .posts({
            where: {
              published: false,
            },
          })

        // return post details
        res.status(200).json({ data: posts });
        return;
    } catch (err) {
        next(err);
    }
}

export const feed = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {

        // get feed params
        const { searchString, skip, take, orderBy } = req.query;

        // get post details
        const posts = await prisma.post.findMany({
            where: {
                published: true,
                content : {
                    contains: searchString as string
                },
            },
            include: { author: true },
            skip: Number(skip) || undefined,
            take: Number(take) || undefined,
            orderBy: {
                updatedAt: orderBy as Prisma.SortOrder,
              },
            })
          
        // return post details
        res.status(200).json({ data: posts });
    } catch (err) {
        next(err);
    }
}

export const togglePublish = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {

        // get the post id from the request
        const postID = Number(req.params);

        // get post details
        const post = await prisma.post.findUnique({
            where: { id: postID },
            select: {
                id: true,
                published: true,
                authorId: true,
            }
        });

        // if post does not exist
        if (!post) {
            next(createHttpError(400, { message: "Post does not exist." }));
            return;
        }

        // check if post is of the same user
        if (post.authorId !== res.locals.userID) {
            next(createHttpError(400, { message: "You are not authorized to perform this action." }));
            return;
        }

        // toggle publish
        const updatedPost = await prisma.post.update({
            where: { id: postID },
            data: {
                published: true
            }
        });

        // return post details
        res.status(200).json({ data: updatedPost });
        return;
    } catch (err) {
        next(err);
    }
}

export const updatePost = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {

        // get the post id from the request
        const postID = Number(req.params);

        // get post details
        const post = await prisma.post.findUnique({
            where: { id: postID },
            select: {
                id: true,
                published: true,
                authorId: true,
            }
        });

        // if post does not exist
        if (!post) {
            next(createHttpError(400, { message: "Post does not exist." }));
            return;
        }

        // check if post if of the user
        if (post.authorId !== res.locals.userID) {
            next(createHttpError(400, { message: "You are not authorized to update this post." }));
            return;
        }

        // toggle publish
        const updatedPost = await prisma.post.update({
            where: { id: postID },
            data: {
                content: req.body.content
            }
        });

        // return post details
        res.status(200).json({ data: updatedPost });
        return;
    } catch (err) {
        next(err);
    }
}

export const deletePost = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {

        // get the post id from the request
        const postID = Number(req.params);

        // get post details
        const post = await prisma.post.findUnique({
            where: { id: postID },
            select: {
                id: true,
                published: true,
                authorId: true
            }
        });

        // if post does not exist
        if (!post) {
            next(createHttpError(400, { message: "Post does not exist." }));
            return;
        }

        // check if post if of the user
        if (post.authorId !== res.locals.userID) {
            next(createHttpError(400, { message: "You are not authorized to delete this post." }));
            return;
        }

        // delete post
        await prisma.post.delete({
            where: { id: postID },
        });

        // return post details
        res.status(200).json({ data: post });
        return;
    } catch (err) {
        next(err);
    }
}

