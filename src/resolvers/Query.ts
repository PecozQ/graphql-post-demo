import { MyContext } from "../prismaContext";

export const  Query =  {
    me: (_: any, __: any, {userInfo, prisma}: MyContext) => {
    if (!userInfo) return null;
    return prisma?.user.findUnique({
        where: {
            id: userInfo.userId
        }
    });
    },
    profile: async (_:any, {userId}: {userId: string}, {prisma}: MyContext ) => {
        return prisma?.profile.findUnique({
            where: {
                userId: Number(userId)
            }
        })
    },
    posts: async (_:any, __:any, { prisma }: MyContext) => {
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