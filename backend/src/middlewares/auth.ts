import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models";

interface CustomError extends Error {
    statusCode?: number;
    validators?: { message: string; value: string };
}

interface CustomRequest extends Request {
    user?: User;
    authError?: CustomError;
}

const auth = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const header = req.get("Authorization");
        if (!header) {
            const error: CustomError = new Error(
                "No Authorization Header is Supplied!"
            );
            error.statusCode = 401;
            throw error;
        }
        const [bearer, token] = header.split(" ");
        if (bearer !== "Bearer" && bearer !== "bearer") {
            const error: CustomError = new Error(
                "Token must be a Bearer token"
            );
            error.statusCode = 401;
            throw error;
        }
        const decodedToken = jwt.verify(
            token,
            process.env.TOKEN_SECRET!
        ) as User | null;
        if (!decodedToken) {
            const error: CustomError = new Error("Invalid Token!");
            error.statusCode = 401;
            throw error;
        }
        const user = await User.findByPk(decodedToken.id);
        if (!user) {
            const error: CustomError = new Error(
                "No user was found with this id!"
            );
            error.statusCode = 405;
            throw error;
        }
        req.user = user as User;
        next();
    } catch (error) {
        if (!error.statusCode) {
            error.message = "Invalid Token!";
            error.statusCode = 401;
        }
        req.authError = error;
        next();
    }
};

export default auth;
