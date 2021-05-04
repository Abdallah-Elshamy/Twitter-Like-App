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

const getUserFromToken = async (header: string | undefined): Promise<User> => {
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
        error.statusCode = 404;
        throw error;
    }
    if (user.isBanned) {
        const error: CustomError = new Error(
            "User is banned and can no longer access the website!"
        );
        error.statusCode = 403;
        throw error;
    }
    return user;
};

const auth = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const header = req.get("Authorization");
        req.user = await getUserFromToken(header) as CustomUser;
        const isAdmin = await UserBelongsToGroup.findOne({
            where: {
                userId: req.user?.id,
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

const authWebSocket = async (connectionParams: any) => {
    try {
        const header = connectionParams.authToken;
        connectionParams.user = await getUserFromToken(header);
    } catch (error) {
        if (!error.statusCode) {
            error.message = "Invalid Token!";
            error.statusCode = 401;
        }
        connectionParams.authError = error;
    }
};

export { auth, authWebSocket };
