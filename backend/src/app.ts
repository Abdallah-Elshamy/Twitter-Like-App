import express, { Application, Request, Response, NextFunction } from "express";
import { ApolloServer } from "apollo-server-express";
import { resolvers, typeDefs } from "./graphql";
import path from "path";
import db from "./db";

const dir: string = path.resolve();

const app: Application = express();

const apolloServer: ApolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    playground: process.env.DEVELOPMENT_ENVIROMENT == "true",
    context: (req) => ({
        req,
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
});

apolloServer.applyMiddleware({ app });

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

const server = db.sync().then(() => {
    const server = app.listen(process.env.PORT!, (): void => {
        console.log(`Server is running on port ${process.env.PORT}!`);
    });
    return server;
});

export { server };
export default app;
