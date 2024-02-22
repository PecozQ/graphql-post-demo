import { MyContext } from "../prismaContext"

interface UserParentType {
    id: number
}

export const User = {
    posts: async(parent: UserParentType, __:any, {userInfo, prisma}: MyContext) => {
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