import { IContext } from "../../prismaContext";

export const  Query =  {
    me: (_: any, __: any, {userInfo, prisma}: IContext) => {
    if (!userInfo) return null;
    return prisma?.user.findUnique({
        where: {
            id: userInfo.userId
        }
    });
    },
    profile: async (_:any, {userId}: {userId: string}, {prisma}: IContext ) => {
        return prisma?.profile.findUnique({
            where: {
                userId: Number(userId)
            }
        })
    },
    posts: async (_:any, __:any, { prisma }: IContext) => {
       const posts = await prisma?.post.findMany({
           where: {
             published: true
           },
           orderBy: [
            {
                createdAt: "desc"
            },
           ],
       });
       return posts;
    }
}