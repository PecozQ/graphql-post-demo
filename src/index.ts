import { ApolloServer } from '@apollo/server';
import { typeDefs  } from './graphql/schema/schema';
import { resolvers } from './graphql/resolvers/resolvers';
import express, { json } from 'express';
import cors from "cors";
import { createServer } from 'http';
import { expressMiddleware } from "@apollo/server/express4";
import { IContext, prisma } from './utils/database/prisma/prismaContext';
import { getUserFromToken } from './utils/functions/getUserFromToken';
import * as dotenv from 'dotenv';
import { errorHandler } from './utils/error/errorHandler';

dotenv.config();

async function main() {
   
   const app = express();
   const httpServer = createServer(app);

   const server = new ApolloServer<IContext>({
    typeDefs,
    resolvers,
    formatError: errorHandler
    });

    await server.start();

    app.use("/", cors<cors.CorsRequest>(), express.json(), expressMiddleware(server, {
        context: async ({req}: any): Promise<IContext> => {
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

