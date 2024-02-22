import { Context } from "../../prismaContext";
import { ProfileParentType } from "../../types/profile.type";

export const profileResolver =  {
    user: (parent: ProfileParentType, __: any, {userInfo, prisma}: Context) => {
        return prisma?.user.findUnique({
              where: {
                id: parent.userId
              }
        })
    }
}