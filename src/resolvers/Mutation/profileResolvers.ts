import { IContext } from "../../prismaContext";
import { IProfileParentType } from "../../types/profile.type";

export const profileResolver =  {
    user: (parent: IProfileParentType, __: any, {userInfo, prisma}: IContext) => {
        return prisma?.user.findUnique({
              where: {
                id: parent.userId
              }
        })
    }
}