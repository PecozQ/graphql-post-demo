import { MyContext } from "../prismaContext"

interface CanUserUpdatePostParams {
    userId: number;
    postId: number;
    prisma: MyContext["prisma"];
}

export const canUserUpdatePost = async ({
    userId,
    postId,
    prisma
}: CanUserUpdatePostParams) => {
   const user = await prisma?.user.findUnique({
    where: {
        id: userId
    }
   });

   if(!user) {
        return {
            userErrors: [{
                message: "User not found"
            }],
            post: null
        }
   }

   const post = await prisma?.post.findUnique({
    where: {
        id: postId
    }
   });

   if (post?.authorId !== user.id) {
    return {
        userErrors: [{
            message: "Post not owned by user"
        }],
        post: null
    }
   }
} 