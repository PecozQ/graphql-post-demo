import { IContext } from "../../../utils/database/prisma/prismaContext";
import { userLoader } from "../../../loader/userLoader";
import { IPostParentType } from "../../../types/post.type";

export const postUserResolver = {
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
    user: (parent: IPostParentType, 
            __: any, 
            {prisma}: IContext) => {
               return userLoader.load(parent.authorId)
            },


}