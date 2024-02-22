import { MyContext } from "../prismaContext";

interface ProfileParentType {
    id: number;
    bio: string;
    userId: number;
}

export const Profile =  {
    user: (parent: ProfileParentType, __: any, {userInfo, prisma}: MyContext) => {
        return prisma?.user.findUnique({
              where: {
                id: parent.userId
              }
        })
    }
}