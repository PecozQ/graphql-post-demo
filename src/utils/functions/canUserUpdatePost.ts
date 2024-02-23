import { ErrorCodes } from "../../types/error.type";
import { ICanUserUpdatePostParams } from "../../types/post.type";
import { BaseError } from "../error/base.error";

export const canUserUpdatePost = async ({
    userId,
    postId,
    prisma
}: ICanUserUpdatePostParams) => {
    try {
        const user = await prisma?.user.findUnique({
            where: {
                id: userId
            }
           });
        
           if(!user) {
                throw new BaseError("User not found", ErrorCodes.INVALID_CREDENTIALS)
           }
        
           const post = await prisma?.post.findUnique({
            where: {
                id: postId
            }
           });
        
           if (post?.authorId !== user.id) {
                throw new BaseError("Post not owned by user", ErrorCodes.INPUT_ERROR)
           }

    } catch(error) {
        if (error instanceof BaseError) {
            throw error
        } else {
            throw new BaseError("Error from validation", ErrorCodes.DB_ERROR)
        }
    }
} 