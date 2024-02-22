import { MyContext } from "../prismaContext";
import { userLoader } from "../loader/userLoader";

interface PostParentType {
    authorId: number;
}

export const Post = {
    // user: (
    //     parent: PostParentType, 
    //     __: any, 
    //     {prisma}: MyContext) => {
    //         return prisma?.user.findUnique({
    //             where: {
    //                 id: parent.authorId
    //             }
    //         })
    //     }
    user: (parent: PostParentType, 
            __: any, 
            {prisma}: MyContext) => {
               return userLoader.load(parent.authorId)
            },


}