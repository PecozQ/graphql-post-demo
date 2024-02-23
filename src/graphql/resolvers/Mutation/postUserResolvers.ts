import { IContext } from "../../../utils/database/prisma/prismaContext";
import { userLoader } from "../../../loader/userLoader";
import { IPostParentType } from "../../../types/post.type";

export const postUserResolver = {
    user: (parent: IPostParentType, 
            __: any, 
            {prisma}: IContext) => {
               return userLoader.load(parent.authorId)
            },
}