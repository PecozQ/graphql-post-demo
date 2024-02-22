import { ApolloServer } from '@apollo/server';
import { typeDefs  } from './schema';
import { Mutation, Query, Profile, Post, User } from './resolvers';
import express, { json } from 'express';
import cors from "cors";
import { createServer } from 'http';
import { expressMiddleware } from "@apollo/server/express4";
import { MyContext, prisma } from './prismaContext';
import { getUserFromToken } from './utils/getUserFromToken';

async function main() {
   
   const app = express();
   const httpServer = createServer(app);

   const server = new ApolloServer<MyContext>({
    typeDefs,
    resolvers: {
        Query,
        Mutation,
        Profile,
        Post,
        User
    }
    });

    await server.start();

    app.use("/", cors<cors.CorsRequest>(), express.json(), expressMiddleware(server, {
        context: async ({req}: any): Promise<MyContext> => {
            const userInfo =  await getUserFromToken(req.headers.bearer)
            return {
                prisma: prisma,
                userInfo
            }
        }
    }));

    const PORT = 8080;
    httpServer.listen(PORT, "0.0.0.0", () => {
        console.info(`Server is now running at ${PORT}`);
    });
}
main();

