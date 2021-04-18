import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User, UserBelongsToGroup } from "../models";

interface CustomError extends Error {
    statusCode?: number;
    validators?: { message: string; value: string };
}

interface CustomUser extends User {
    isAdmin: boolean;
}

interface CustomRequest extends Request {
    user?: CustomUser;
    authError?: CustomError;
}

const auth = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const header = req.get("Authorization");
        if (!header) {
            const error: CustomError = new Error(
                "No Authorization Header was supplied!"
            );
            error.statusCode = 401;
            throw error;
        }
        const [bearer, token] = header.split(" ");
        if (bearer !== "Bearer" && bearer !== "bearer") {
            const error: CustomError = new Error(
                "Token must be a Bearer token!"
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
        if (user.isBanned) {
            const error: CustomError = new Error(
                "User is banned and can no longer access the website!"
            );
            error.statusCode = 403;
            throw error;
        }
        req.user = user as CustomUser;
        const isAdmin = await UserBelongsToGroup.findOne({
            where: {
                userId: user?.id,
                groupName: "admin",
            },
        });
        if (isAdmin) {
            req.user.isAdmin = true;
        } else {
            req.user.isAdmin = false;
        }
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
