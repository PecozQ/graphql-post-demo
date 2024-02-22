import { Context } from "../../prismaContext";
import { userLoader } from "../../loader/userLoader";
import { PostParentType } from "../../types/post.type";

export const userPostResolver = {
    // user: (
    //     parent: PostParentType, 
    //     __: any, 
    //     {prisma}: Context) => {
    //         return prisma?.user.findUnique({
    //             where: {
    //                 id: parent.authorId
    //             }
    //         })
    //     }
    user: (parent: PostParentType, 
            __: any, 
            {prisma}: Context) => {
               return userLoader.load(parent.authorId)
            },


}