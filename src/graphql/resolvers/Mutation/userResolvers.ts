import { IContext } from "../../../utils/database/prisma/prismaContext"
import { IUserParentType } from "../../../types/user.type";

export const userResolver = {
    posts: async(parent: IUserParentType, __:any, {userInfo, prisma}: IContext) => {
        const isOwnProfile = parent.id === userInfo?.userId;
        if (isOwnProfile) {
            return prisma?.post.findMany({
                where: {
                    authorId: parent.id
                },
                orderBy: [
                    {
                        createdAt: "desc"
                    }
                ]
            })
        } else {
            return prisma?.post.findMany({
                where: {
                    authorId: parent.id,
                    published: true,
                },
                orderBy: [
                    {
                        createdAt: "desc",
                    },
                ],
            });
        }
    }
}