import { IContext } from "../../../utils/database/prisma/prismaContext";

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
       let posts;
       try {
        posts = await prisma?.post.findMany({
            where: {
              published: true
            },
            orderBy: [
             {
                 createdAt: "desc"
             },
            ],
        });

       } catch(error) {
            throw new Error("Querying Post error from DB")
       }
       return posts;
    }
}