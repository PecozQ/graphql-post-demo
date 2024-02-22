import { Context } from "../../prismaContext"
import { UserParentType } from "../../types/user.type";

export const userResolver = {
    posts: async(parent: UserParentType, __:any, {userInfo, prisma}: Context) => {
        const isOwnProfile = parent.id === userInfo?.userId;
        console.log('The is own profile is given as:', isOwnProfile);
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