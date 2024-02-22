import { ApolloServer } from '@apollo/server';
import { typeDefs  } from './schema';
import { Mutation, Query } from './resolvers';
import express, { json } from 'express';
import cors from "cors";
import { createServer } from 'http';
import { expressMiddleware } from "@apollo/server/express4";
import { Context, prisma } from './prismaContext';
import { getUserFromToken } from './utils/getUserFromToken';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
   
   const app = express();
   const httpServer = createServer(app);

   const server = new ApolloServer<Context>({
    typeDefs,
    resolvers: {
        Query,
        Mutation
    }
    });

    await server.start();

    app.use("/", cors<cors.CorsRequest>(), express.json(), expressMiddleware(server, {
        context: async ({req}: any): Promise<Context> => {
            const userInfo =  await getUserFromToken(req.headers.bearer)
            return {
                prisma: prisma,
                userInfo
            }
        }
    }));

    const PORT = Number(process.env.PORT) || 8080;
    await httpServer.listen(PORT, "0.0.0.0", () => {
        console.info(`Server is now running at ${PORT}`);
    });
}
main();

