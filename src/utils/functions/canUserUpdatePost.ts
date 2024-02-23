import { ICanUserUpdatePostParams } from "../../types/post.type";

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
            // return {
            //     userErrors: [{
            //         message: "User not found"
            //     }],
            //     post: null
            // }
            return new Error("User not found")
       }
    
       const post = await prisma?.post.findUnique({
        where: {
            id: postId
        }
       });
    
       if (post?.authorId !== user.id) {
            return new Error("Post not owned by user")
       }
   } catch (error) {
    return new Error("Error on can user update post ")
   }
} 