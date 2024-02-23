import { Post, Prisma } from "@prisma/client";
import { IContext } from "../../../utils/database/prisma/prismaContext";
import { canUserUpdatePost } from "../../../utils/functions/canUserUpdatePost";
import { IPostArgs, IPostPayloadType } from "../../../types/post.type";

export const postResolvers = {
    postCreate: async (
        _:any, 
        { post }:IPostArgs, 
        {prisma, userInfo}: IContext): Promise<IPostPayloadType | Error> => {
        if (!userInfo) {
            throw new Error("Invalid Bearer Token")
        }

        const { title, content } = post; 
        if (!title || !content) {
            throw new Error("You must provide title and content to create a post")
        }
        return {
            post: prisma?.post.create({ 
                data: {
                    title,
                    content,
                    authorId: userInfo.userId
                }
            })
        }
 
    },
    postUpdate: async (
        _: any, 
        { post, postId }: {postId: string, post: IPostArgs["post"]}, 
        {prisma, userInfo}: IContext
        ): Promise<IPostPayloadType | Error> => {
        if (!userInfo) {
             throw new Error("Invalid Bearer token");
        }
        const error = await canUserUpdatePost({
              userId: userInfo.userId,
              postId: Number(postId),
              prisma
        });

        if (error) return error

        const {title, content} = post;

        if (!title && !content) {
            return new Error("Need to have atleast one field to update")
        }
        const existingPost = await prisma?.post.findUnique({
            where: {
                id: Number(postId)
            }
        });

        if (!existingPost) {
            return new Error("Post does not exist")
        }

        let payloadToUpdate = {
            title,
            content
        }

        if (!title) delete payloadToUpdate.title
        if (!content) delete payloadToUpdate.content

        return {
            post: prisma?.post.update({
                data: {
                  ...payloadToUpdate
                },
                where: {
                    id: Number(postId)
                }
            })
        }

    },
    postDelete: async (_:any, 
        {postId}: {postId: string},
        {prisma, userInfo}: IContext): Promise<IPostPayloadType | Error> => {
        if (!userInfo) {
            throw new Error("Invalid Bearer token");
        }
        const error = await canUserUpdatePost({
              userId: userInfo.userId,
              postId: Number(postId),
              prisma
        });

        if (error) return error

            const post = await prisma?.post.findUnique({
                where: {
                    id: Number(postId)
                }
            });
            if (!post) {
                return new Error("Post does not exist")
            }

            await prisma?.post.delete({
                where: {
                    id: Number(postId)
                }
            });

            return {
                post
            }

        },
    postPublish: async (
        _: any, 
        {postId}: {postId: string}, 
        {prisma, userInfo}: IContext): Promise<IPostPayloadType> => {
        if (!userInfo) {
            throw new Error("Invalid Bearer token");
        }
        const error = await canUserUpdatePost({
            userId: userInfo.userId,
            postId: Number(postId),
            prisma
        });

        if (error) throw error;
        let post;
        try {
            post = await prisma?.post.update({
                where: {
                    id: Number(postId)
                },
                data: {
                    published: true,
                },
            })

        } catch(err) {
            throw new Error("Error on updating post from DB")
        }

        return {
            post: post,
        };        

    },
    postUnpublish: async (
        _: any, 
        {postId}: {postId: string}, 
        {prisma, userInfo}: IContext): Promise<IPostPayloadType> => {
        if (!userInfo) {
            throw new Error("Invalid Bearer Token")
        }
        const error = await canUserUpdatePost({
              userId: userInfo.userId,
              postId: Number(postId),
              prisma
        });

        if (error) throw error;
        let post;
        try {
            post = await prisma?.post.update({
                where: {
                    id: Number(postId)
                },
                data: {
                    published: true,
                },
            })

        } catch(err) {
            throw new Error("Error on updating post from DB")
        }

        return {
            post: post,
        };        

    }
}