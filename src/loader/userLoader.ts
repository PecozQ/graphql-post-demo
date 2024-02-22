import { User } from "@prisma/client";
import DataLoader from "dataloader";
import { prisma } from "../prismaContext";

type BatchUser = (ids: number[]) => Promise<User[]>

const batchUsers: BatchUser = async (ids) => {
    console.log(ids);
    const users = await prisma.user.findMany({
        where: {
            id: {
                in: ids
            }
        }
    });
    // [1 , 3, 2]

    // and we get back in a jumbled format [{id:3}, {id:2}, {id:1}]

    // so we need it in the above array order
    const userMap: {[key:string]: User} = {};

    users.forEach((user) => {
        userMap[user.id] = user
    })

    return ids.map((id) => userMap[id])
}

//@ts-ignore
export const userLoader = new DataLoader<number, User>(batchUsers);

