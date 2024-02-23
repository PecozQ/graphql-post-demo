import { Profile } from "@prisma/client";
import { ErrorCodes } from "../../../types/error.type";
import { IContext } from "../../../utils/database/prisma/prismaContext";
import { BaseError } from "../../../utils/error/base.error";

export const  Query =  {
    /**
     * 
     * This function is used to retrieve the logged in user data
     * 
     * @requires Bearer 
     * @returns user
     */
    me: (_: any, __: any, {userInfo, prisma}: IContext) => {
        if (!userInfo) return null;
        let user;
        try {
        user = prisma?.user.findUnique({
            where: {
                id: userInfo.userId
            }
        });
        } catch (e) {
        throw new BaseError ("Failed to retrieve user from db", ErrorCodes.DB_ERROR);
        }
        return user;
    },
    /**
     * 
     * This function is used to get the profile data
     * 
     * @requires Bearer
     * @param {string} userId
     * @returns profile
     */
    profile: async (_:any, {userId}: {userId: string}, {prisma}: IContext ) => {
        let profile;
        try {
            profile = await prisma?.profile.findUnique({
            where: {
                userId: Number(userId)
            }
            })
        } catch (error) {
            throw new BaseError("Failed to retrieve profile from db", ErrorCodes.DB_ERROR);
        }
        return profile;
    },
    /**
     * 
     * This function is used to get all the public post
     * 
     */
    posts: async (_:any, __:any, { prisma }: IContext) => {
       let posts;
       try {
        posts = await prisma?.post.findMany({
            where: {
              isPublic: true
            },
            orderBy: [
             {
                 createdAt: "desc"
             },
            ],
            });
        } catch(error) {
            throw new BaseError("Failed to retrieve posts from DB", ErrorCodes.DB_ERROR);
        }
        return posts;
    },
    /**
     * 
     * This function is used to get all the public post of the logged in user
     * @requires Bearer
     */
    getPublicPost: async (_:any, __:any, { prisma, userInfo }: IContext) => {
        if (!userInfo)  throw new BaseError("Missing Bearer Token", ErrorCodes.INVALID_REQUEST_BEARER_MISSING);
        let posts;
        try {
         posts = await prisma?.post.findMany({
             where: {
               isPublic: true,
               authorId: +userInfo.userId,
             },
             orderBy: [
              {
                  createdAt: "desc"
              },
             ],
         });
        } catch(error) {
             throw new BaseError("Failed to retrieve data from DB", ErrorCodes.DB_ERROR);
        }
        return posts;
    },
    /**
     * 
     * This function is used to get all the private post of the logged in user
     * 
     * @requires Bearer
     */
    getPrivatePost: async (_:any, __:any, { prisma, userInfo }: IContext) => {
        if (!userInfo)  throw new BaseError("Missing Bearer Token", ErrorCodes.INVALID_REQUEST_BEARER_MISSING);
        let posts;
        try {
         posts = await prisma?.post.findMany({
             where: {
               isPublic: false,
               authorId: +userInfo.userId,
             },
             orderBy: [
              {
                  createdAt: "desc"
              },
             ],
         });
        } catch(error) {
             throw new BaseError("Failed to retrieve data from DB", ErrorCodes.DB_ERROR);
        }
        return posts;
    },
    /**
     * 
     * This function is used to list all the post viewable for the logged in user
     */
    getAllPostForLoggedUser: async (_:any,  __:any, {prisma, userInfo}: IContext ) => {
        if (!userInfo) throw new BaseError("Missing Bearer Token", ErrorCodes.INVALID_REQUEST_BEARER_MISSING);
        let posts: any;
        let mergedPosts: any;
        try {
            posts = await prisma?.user.findMany({
                where:{
                    id: userInfo.userId
                },
                select:{
                    assignedTo:{
                        where:{
                            userId:  userInfo.userId
                        },
                        select:{
                            post: true
                        }
                    },
                    posts: true
                }
            })
            mergedPosts = posts.flatMap((post: any) => {
                const assignedTo = post.assignedTo.map((job: any) => job.post);
                const publicPosts = post.posts;
                return assignedTo.concat(publicPosts);
              });
        } catch(error) {
             throw new BaseError("Failed to retrieve posts from DB", ErrorCodes.DB_ERROR);
        }
        return mergedPosts;
    }
}