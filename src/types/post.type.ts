import { Post, Prisma } from "@prisma/client";
import { IContext } from "../utils/database/prisma/prismaContext";

export interface IPostArgs {
    post : {
     title?: string;
     content?: string;
    }
 }
 
export interface IPostPayloadType {
     post?: Post | Prisma.Prisma__PostClient<Post> | null | undefined;
 }

 export interface IPostParentType {
    authorId: number;
}

export interface ICanUserUpdatePostParams {
    userId: number;
    postId: number;
    prisma: IContext["prisma"];
}

export interface IPostUserArgs {
   post : {
   postId: number,
   userId: number
   }
 }

 export interface IPostAccessUpdateArgs {
    post: {
        postId: number
    }
 }
 export interface IPostMsgPayloadType {
    message: string;
 }