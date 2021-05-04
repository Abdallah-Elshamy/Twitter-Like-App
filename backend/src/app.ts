import express, { Application, Request, Response, NextFunction } from "express";
import { ApolloServer } from "apollo-server-express";
import cron from "node-cron";
import http from "http";
import { resolvers, typeDefs } from "./graphql";
import path from "path";
import db from "./db";
import { auth, authWebSocket } from "./middlewares";
import { SFWRegularCheck } from "./graphql/resolvers/tweet";

const dir: string = path.resolve();

const app: Application = express();

app.use(auth);

const apolloServer: ApolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    playground: process.env.DEVELOPMENT_ENVIROMENT == "true",
    context: ({ req, connection }) => ({
        req,
        connection,
    }),
    formatError: (err) => {
        if (!err.originalError) {
            return err;
        }
        const error: any = err.originalError;
        return {
            statusCode: error.statusCode,
            message: error.message,
            validators: error.validators,
        };
    },
    subscriptions: {
        path: "/subscriptions",
        onConnect: async (
            connectionParams: any,
            webSocket: any,
            context: any
        ) => {
            console.log("Client connected");
            await authWebSocket(connectionParams);
            const { user, authError } = connectionParams;
            if (authError) {
                throw authError;
            } else {
                return user;
            }
        },
        onDisconnect: (webSocket, context) => {
            console.log("Client disconnected");
        },
    },
});

apolloServer.applyMiddleware({ app });

const httpServer = http.createServer(app);
apolloServer.installSubscriptionHandlers(httpServer);

app.use("/uploads", express.static(path.join(dir, "uploads")));

app.use((req: Request, res: Response, next: NextFunction): void => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
    );
    next();
});

const serverPromise = db.sync().then(() => {
    cron.schedule("0 * * * *", () => {
        console.log("running SFW regular check on tweets");
        SFWRegularCheck();
    });

    const server = httpServer.listen(process.env.PORT!, (): void => {
        console.log(`Server is running on port ${process.env.PORT}!`);
    });
    return server;
});

export { serverPromise };
export default app;
