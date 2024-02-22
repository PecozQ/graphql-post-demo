import { Post, Prisma } from "@prisma/client";
import { Context } from "../prismaContext";

export interface PostArgs {
    post : {
     title?: string;
     content?: string;
    }
 }
 
export interface PostPayloadType {
     userErrors: {
         message: string
     }[];
     post: Post | Prisma.Prisma__PostClient<Post> | null | undefined;
 }

 export interface PostParentType {
    authorId: number;
}

export interface CanUserUpdatePostParams {
    userId: number;
    postId: number;
    prisma: Context["prisma"];
}
