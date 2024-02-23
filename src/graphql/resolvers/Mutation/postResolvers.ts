import { Post, Prisma } from "@prisma/client";
import { IContext } from "../../../utils/database/prisma/prismaContext";
import { canUserUpdatePost } from "../../../utils/functions/canUserUpdatePost";
import { IPostAccessUpdateArgs, IPostArgs, IPostPayloadType, IPostUserArgs, IPostMsgPayloadType } from "../../../types/post.type";
import { BaseError } from "../../../utils/error/base.error";
import { ErrorCodes } from "../../../types/error.type";

export const postResolvers = {
    /**
     * This function is used to create a new post for the logged in user
     *  
     * @requires Bearer
     * @param {IPostArgs} post
     * @returns {Promise<IPostPayloadType | Error>} return the created post
     */
    postCreate: async (
        _: any,
        { post }: IPostArgs,
        { prisma, userInfo }: IContext): Promise<IPostPayloadType> => {
        if (!userInfo) {
            throw new BaseError("Missing Bearer Token", ErrorCodes.INVALID_REQUEST_BEARER_MISSING);
        }
        const { title, content } = post;
        if (!title || !content) {
            throw new BaseError("You must provide title and content to create a post", ErrorCodes.INPUT_ERROR);
        }
        try {
            return {
                post: prisma?.post.create({
                    data: {
                        title,
                        content,
                        authorId: userInfo.userId
                    }
                })
            }
        } catch (error) {
            throw new BaseError("Post creation in db failed", ErrorCodes.DB_ERROR)
        }

    },
    /**
     * This function is used to update a particular post
     * 
     * @requires Bearer
     * @param {string} postId
     * @param {IPostArgs["post"]} post
     * @returns {Promise<IPostPayloadType | Error>} return the updated post
     */
    postUpdate: async (
        _: any,
        { post, postId }: { postId: string, post: IPostArgs["post"] },
        { prisma, userInfo }: IContext
    ): Promise<IPostPayloadType> => {
        if (!userInfo) {
            throw new BaseError("Missing Bearer Token", ErrorCodes.INVALID_REQUEST_BEARER_MISSING);
        }
        await canUserUpdatePost({ userId: userInfo.userId, postId: Number(postId), prisma });

        const { title, content } = post;
        if (!title && !content) {
            throw new BaseError("Need to have atleast one field to update", ErrorCodes.INPUT_ERROR)
        }
        let existingPost;
        try {
            existingPost = await prisma?.post.findUnique({
                where: {
                    id: Number(postId)
                }
            });
            if (!existingPost) {
                throw new BaseError("Post does not exist", ErrorCodes.INVALID_CREDENTIALS)
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
        } catch (err) {
            if (err instanceof BaseError) throw err
            else throw new BaseError("Failed to update the post from db", ErrorCodes.DB_ERROR)
        }

    },
    /**
     * This function is used to delete the post based on the postId
     * 
     * @requires Bearer
     * @param {string} postId
     * @returns {Promise<IPostMsgPayloadType | Error>} returns the message
     */
    postDelete: async (_: any,
        { postId }: { postId: string },
        { prisma, userInfo }: IContext): Promise<IPostMsgPayloadType> => {
        if (!userInfo) {
            throw new BaseError("Missing Bearer Token", ErrorCodes.INVALID_REQUEST_BEARER_MISSING);
        }
        await canUserUpdatePost({
            userId: userInfo.userId,
            postId: Number(postId),
            prisma
        });
        try {
            const post = await prisma?.post.findUnique({
                where: {
                    id: Number(postId)
                }
            });
            if (!post) {
                throw new BaseError("Post does not exist", ErrorCodes.INVALID_CREDENTIALS)
            }
            await prisma?.post.delete({
                where: {
                    id: Number(postId)
                }
            });
        } catch (error) {
            if (error instanceof BaseError) throw error
            else throw new BaseError("Error from Post delete", ErrorCodes.DB_ERROR)
        }
        return {
            message: "Post Updated Successfully"
        }

    },
    /**
     * This function updates a particular postId given in the input to public
     * 
     * @requires Bearer
     * @param {IPostAccessUpdateArgs} post
     * @returns {Promise<IPostPayloadType | Error>} returns the updated post
     */
    updateIsPublic: async (
        _: any,
        { postId }: { postId: string },
        { prisma, userInfo }: IContext): Promise<IPostPayloadType> => {
        if (!userInfo) {
            throw new BaseError("Missing Bearer Token", ErrorCodes.INVALID_REQUEST_BEARER_MISSING);
        }
        if (!postId) {
            throw new BaseError("Post id is missing", ErrorCodes.INPUT_ERROR);
        }
        await canUserUpdatePost({
            userId: userInfo.userId,
            postId: Number(postId),
            prisma
        });
        await prisma?.userPostAccessDetails.deleteMany({
                        where: {
                            postId: +postId
                        }
        });
        return {
            post:  prisma?.post.update({
                where: {
                    id: +postId
                },
                data: {
                    isPublic: true
                }
            })
        }
    },
    /**
     * This functions gives access to a private post for a particular user
     * 
     * @requires Bearer
     * @param {IPostUserArgs} post
     * @returns { Promise<IPostMsgPayloadType | Error>} returns the status of the update
     */
    updatePrivatePostAccess: async (
        _: any,
        { post }: IPostUserArgs,
        { prisma, userInfo }: IContext): Promise<IPostMsgPayloadType> => {
        if (!userInfo) {
            throw new BaseError("Missing Bearer Token", ErrorCodes.INVALID_REQUEST_BEARER_MISSING);
        }
        try {
            const { postId, userId } = post
            if (!postId && !userId) {
                throw new BaseError("Please Provide sufficient input", ErrorCodes.INPUT_ERROR)
            } else {
                const getPostdetails = await prisma?.post.findFirst({
                    where: {
                        id: +postId,
                        authorId: +userInfo.userId
                    },
                    select: {
                        isPublic: true
                    }
                })
                console.log('The get post detaisl is given as:', getPostdetails);
                if (getPostdetails && !getPostdetails.isPublic) {
                    await prisma?.userPostAccessDetails.create({
                        data: {
                            postId: +postId,
                            userId: +userId,
                            assginerId: +userInfo.userId
                        }
                    })
                    return { message: "Post successfully assigned to user" };
                } else {
                    throw new BaseError("Post is already public!", ErrorCodes.ALREADY_EXIST)
                }
            }
        } catch (error: any) {
            if (error instanceof BaseError) throw error;
            throw new BaseError("Failed to give access to post", ErrorCodes.DB_ERROR);
        }
    },
}