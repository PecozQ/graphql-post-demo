import { IContext } from "../../../utils/database/prisma/prismaContext"
import { IUserParentType } from "../../../types/user.type";
import { BaseError } from "../../../utils/error/base.error";
import { ErrorCodes } from "../../../types/error.type";

export const userResolver = {
    /**
     * 
     * @param {IUserParentType} parent 
     * @returns 
     */
    posts: async(parent: IUserParentType, __:any, {userInfo, prisma}: IContext) => {
        const isOwnProfile = parent.id === userInfo?.userId;
        try {
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
                        isPublic: true,
                    },
                    orderBy: [
                        {
                            createdAt: "desc",
                        },
                    ],
                });
            }
        } catch (error) {
            throw new BaseError("Failed to retrieve post from db",ErrorCodes.DB_ERROR);
        }
    }
}