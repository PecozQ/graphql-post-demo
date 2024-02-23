import { Post, Prisma } from "@prisma/client";
import { IContext } from "../prismaContext";

export interface IPostArgs {
    post : {
     title?: string;
     content?: string;
    }
 }
 
export interface IPostPayloadType {
     userErrors?: {
         message: string
     }[];
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
