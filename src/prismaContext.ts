import { PrismaClient } from "@prisma/client";


export const prisma = new PrismaClient();
export interface IContext {
    prisma?: typeof prisma;
    userInfo?: {
        userId: number; 
    } | null;
} 