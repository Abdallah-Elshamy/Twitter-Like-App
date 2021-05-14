import bcrypt from "bcryptjs";
import validator from "validator";
import {
    User,
    Tweet,
    UserBelongsToGroup,
    ReportedUser,
    Group,
    MutedUser,
} from "../../models";
import UserValidator from "../../validators/user";
import db from "../../db";
import { fn, col, Op } from "sequelize";
import jwt from "jsonwebtoken";

const PAGE_SIZE = 10;

interface CustomeError extends Error {
    statusCode?: number;
    validators?: { message: string; value: string }[];
}

interface CustomUser extends User {
    isAdmin: boolean;
}

interface CustomeRequest extends Request {
    user?: CustomUser;
    authError?: CustomeError;
}

interface UserInput {
    userName: string;
    email: string;
    password: string;
    name: string;
    birthDate: string;
    imageURL: string;
    coverImageURL: string;
    bio: string;
}

export default {
    Query: {
        user: async (
            parent: any,
            args: { id: number },
            context: any,
            info: any
        ) => {
            const { id } = args;
            const user = await User.findByPk(id);
            if (user) {
                return user;
            } else {
                const error: any = new Error("No user was found with this id!");
                error.statusCode = 404;
                throw error;
            }
        },
        users: async (
            parent: any,
            args: { search: string; page: number },
            context: any,
            info: any
        ) => {
            const { search, page } = args;
            const searchConditions = {
                where: {
                    [Op.or]: [
                        {
                            userName: {
                                [Op.iLike]: "%" + search + "%",
                            },
                        },
                        {
                            name: {
                                [Op.iLike]: "%" + search + "%",
                            },
                        },
                    ],
                },
            };
            return {
                users: await User.findAll({
                    ...searchConditions,
                    offset: ((page || 1) - 1) * PAGE_SIZE,
                    limit: PAGE_SIZE,
                }),
                totalCount: User.count(searchConditions),
            };
        },
        login: async (
            parent: any,
            args: { userNameOrEmail: string; password: string }
        ) => {
            let { userNameOrEmail, password } = args;
            if (validator.isEmail(userNameOrEmail)) {
                userNameOrEmail =
                    validator.normalizeEmail(userNameOrEmail) ||
                    userNameOrEmail;
            }
            const user = await User.findOne({
                where: {
                    [Op.or]: [
                        { userName: userNameOrEmail },
                        { email: userNameOrEmail },
                    ],
                },
            });
            if (!user) {
                const error: any = new Error(
                    "No user was found with this user name or email!"
                );
                error.statusCode = 404;
                throw error;
            }
            if (user.isBanned) {
                const error: any = new Error(
                    "User is banned and can no longer access the website!"
                );
                error.statusCode = 403;
                throw error;
            }
            const isCorrectPassword = await bcrypt.compare(
                password,
                user.hashedPassword
            );
            if (!isCorrectPassword) {
                const error: any = new Error(
                    "The password you entered is incorrect!"
                );
                error.statusCode = 401;
                throw error;
            }
            const token = jwt.sign(
                {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    userName: user.userName,
                    imageURL: user.imageURL,
                    coverImageURL: user.coverImageURL,
                    birthDate: user.birthDate,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                },
                process.env.TOKEN_SECRET!
            );
            return {
                token,
            };
        },
        reportedUsers: async (
            parent: any,
            args: { page: number },
            context: { req: CustomeRequest }
        ) => {
            const { user, authError } = context.req;
            const { page } = args;
            if (authError) {
                throw authError;
            }
            if (!user?.isAdmin) {
                const error: CustomeError = new Error(
                    "User must be an admin to get the reported users!"
                );
                error.statusCode = 403;
                throw error;
            }

            return {
                users: async () => {
                    const reportedUsers = await ReportedUser.findAll({
                        attributes: ["reportedId"],
                        order: [[fn("count", col("reporterId")), "DESC"]],
                        group: "reportedId",
                        offset: ((page || 1) - 1) * PAGE_SIZE,
                        limit: PAGE_SIZE,
                    });

                    const sortedUsersIds = reportedUsers.map(
                        (reportedUser) => reportedUser.reportedId
                    );

                    const unsortedUsers = await User.findAll({
                        where: { id: sortedUsersIds },
                    });
                    const sortedUsers: User[] = [];
                    for (let userId of sortedUsersIds) {
                        let cUser = unsortedUsers.find(
                            (user) => user.id === userId
                        );
                        sortedUsers.push(cUser!);
                    }
                    return sortedUsers;
                },
                totalCount: async () => {
                    return ReportedUser.count({
                        distinct: true,
                        col: "reportedId",
                    });
                },
            };
        },
    },
    Mutation: {
        createUser: async (parent: any, args: any, context: any, info: any) => {
            const { userInput } = args;
            const validators = UserValidator(userInput);
            // sanitize the email before processing it
            userInput.email = validator.normalizeEmail(userInput.email);
            if (await User.findOne({ where: { email: userInput.email } })) {
                validators.push({
                    message: "This email address is already being used!",
                    value: "email",
                });
            }
            if (
                await User.findOne({ where: { userName: userInput.userName } })
            ) {
                validators.push({
                    message: "This user name is already being used!",
                    value: "userName",
                });
            }
            if (validators.length > 0) {
                const error: any = new Error("Validation error!");
                error.statusCode = 422;
                error.validators = validators;
                throw error;
            }
            userInput.hashedPassword = await bcrypt.hash(
                userInput.password,
                12
            );
            delete userInput.password;
            const user = await db.transaction(async (transaction) => {
                const newUser = await User.create(userInput, { transaction });
                await newUser.$add("following", newUser, { transaction });
                return newUser;
            });

            return user;
        },
        updateUser: async (
            parent: any,
            args: { userInput: UserInput },
            context: any,
            info: any
        ) => {
            const { user, authError } = context.req;
            if (authError) {
                throw authError;
            }
            const toBeUpdatedUser = user as User;
            const { userInput } = args;
            const validators = UserValidator(userInput);
            if (validators.length > 0) {
                const error: any = new Error("Validation error!");
                error.statusCode = 422;
                error.validators = validators;
                throw error;
            }

            const {
                userName,
                email,
                password,
                name,
                birthDate,
                imageURL,
                bio,
                coverImageURL,
            } = userInput;

            if (userName) {
                const user = await User.findOne({
                    where: { userName: userName },
                });
                if (user) {
                    const error: any = new Error(
                        "This username is already used!"
                    );
                    error.statusCode = 422;
                    throw error;
                }
                toBeUpdatedUser.userName = userName;
            }
            if (email) {
                const sanitized = validator.normalizeEmail(email) as string;
                const user = await User.findOne({
                    where: { email: sanitized },
                });
                if (user) {
                    const error: any = new Error("This email is already used!");
                    error.statusCode = 422;
                    throw error;
                }
                toBeUpdatedUser.email = sanitized;
            }
            if (password) {
                const hashedPw = await bcrypt.hash(password, 12);
                toBeUpdatedUser.hashedPassword = hashedPw;
            }
            if (birthDate) {
                toBeUpdatedUser.birthDate = new Date(birthDate);
            }
            if (name) {
                toBeUpdatedUser.name = name;
            }
            if (imageURL) {
                toBeUpdatedUser.imageURL = imageURL;
            }
            if (bio) {
                toBeUpdatedUser.bio = bio;
            }
            if (coverImageURL) {
                toBeUpdatedUser.coverImageURL = coverImageURL;
            }
            const updatedUser = await db.transaction(async (transaction) => {
                return await toBeUpdatedUser.save({ transaction });
            });

            return updatedUser;
        },
        like: async (
            parent: any,
            args: { tweetId: number },
            context: any,
            info: any
        ) => {
            const { user, authError } = context.req;
            if (authError) {
                throw authError;
            }
            const currentUser = user as User;
            const tweet: any = await Tweet.findByPk(args.tweetId);
            if (!tweet) {
                const error: any = new Error(
                    "No tweet was found with this id!"
                );
                error.statusCode = 404;
                throw error;
            }

            if (tweet.state === "R") {
                const error: any = new Error(
                    "Can't reply to or like a retweeted tweet!"
                );
                error.statusCode = 422;
                throw error;
            }

            const isLiked = await currentUser.$has("likes", tweet);

            // check if the entered tweet is liked by the current user
            if (isLiked) {
                const error: any = new Error("This tweet is already liked!");
                error.statusCode = 422;
                throw error;
            }
            await db.transaction(async (transaction) => {
                return await currentUser.$add("likes", tweet, { transaction });
            });

            return true;
        },
        unlike: async (
            parent: any,
            args: { tweetId: number },
            context: any,
            info: any
        ) => {
            const { user, authError } = context.req;
            if (authError) {
                throw authError;
            }
            const currentUser = user as User;
            const tweet = await Tweet.findByPk(args.tweetId);
            if (!tweet) {
                const error: any = new Error(
                    "No tweet was found with this id!"
                );
                error.statusCode = 404;
                throw error;
            }
            const isLiked = await currentUser.$has("likes", tweet);

            // check if the entered tweet is liked by the current user
            if (!isLiked) {
                const error: any = new Error(
                    "The current user doesn't like this tweet"
                );
                error.statusCode = 422;
                throw error;
            }
            await db.transaction(async (transaction) => {
                return await currentUser.$remove("likes", tweet, {
                    transaction,
                });
            });

            return true;
        },
        follow: async (
            parent: any,
            args: { userId: number },
            context: any,
            info: any
        ) => {
            const { user, authError } = context.req;
            if (authError) {
                throw authError;
            }
            const currentUser = user as User;

            // check if the user is trying to follow himself
            if (currentUser.id === +args.userId) {
                const error: any = new Error(
                    "The userId and the currentUserId are the same!"
                );
                error.statusCode = 422;
                throw error;
            }

            // check if the entered user is found in the database
            const toBeFollowed: any = await User.findByPk(args.userId);
            if (!toBeFollowed) {
                const error: any = new Error("No user was found with this id!");
                error.statusCode = 404;
                throw error;
            }
            const isFollowing = await currentUser.$has(
                "following",
                toBeFollowed
            );
            // check if the current user is following the entered user
            if (isFollowing) {
                const error: any = new Error("This user is already followed!");
                error.statusCode = 422;
                throw error;
            }
            await db.transaction(async (transaction) => {
                return await currentUser.$add("following", toBeFollowed, {
                    transaction,
                });
            });

            return true;
        },
        unfollow: async (
            parent: any,
            args: { userId: number },
            context: any,
            info: any
        ) => {
            const { user, authError } = context.req;
            if (authError) {
                throw authError;
            }
            const currentUser = user as User;

            // check if the user is trying to follow himself
            if (currentUser.id === +args.userId) {
                const error: any = new Error(
                    "The user can't unfollow himself!"
                );
                error.statusCode = 422;
                throw error;
            }

            // check if the entered user is found in the database
            const toBeUnfollowed = await User.findByPk(args.userId);
            if (!toBeUnfollowed) {
                const error: any = new Error("No user was found with this id!");
                error.statusCode = 404;
                throw error;
            }
            const isFollowing = await currentUser.$has(
                "following",
                toBeUnfollowed
            );
            // check if the current user is following the entered user
            if (!isFollowing) {
                const error: any = new Error(
                    "The current user is not following this user"
                );
                error.statusCode = 422;
                throw error;
            }
            await db.transaction(async (transaction) => {
                await currentUser.$remove("following", toBeUnfollowed, {
                    transaction,
                });
            });
            await currentUser.$remove("following", toBeUnfollowed);

            return true;
        },
        banUser: async (
            parent: any,
            args: { userId: number },
            context: { req: CustomeRequest },
            info: any
        ) => {
            const { user, authError } = context.req;
            const { userId } = args;
            if (authError) {
                throw authError;
            }
            if (!user?.isAdmin) {
                const error: CustomeError = new Error(
                    "Only admins can ban users!"
                );
                error.statusCode = 403;
                throw error;
            }
            const userToBeBanned = await User.findByPk(userId);
            if (!userToBeBanned) {
                const error: CustomeError = new Error(
                    "No user was found with this id!"
                );
                error.statusCode = 404;
                throw error;
            }
            if (userToBeBanned?.isBanned) {
                const error: CustomeError = new Error(
                    "This user is already banned!"
                );
                error.statusCode = 422;
                throw error;
            }
            const isAdmin = await UserBelongsToGroup.findOne({
                where: {
                    userId: userId,
                    groupName: "admin",
                },
            });
            if (isAdmin) {
                const error: CustomeError = new Error(
                    "Admin user can not be banned!"
                );
                error.statusCode = 403;
                throw error;
            }

            await db.transaction(async (transaction) => {
                userToBeBanned.isBanned = true;
                await userToBeBanned.save({ transaction });
                await ReportedUser.destroy({
                    where: { reportedId: userId },
                    transaction,
                });
            });

            return true;
        },
        reportUser: async (
            parent: any,
            args: { userId: number; reason: string },
            context: { req: CustomeRequest },
            info: any
        ) => {
            const { user, authError } = context.req;
            const { userId } = args;
            if (authError) {
                throw authError;
            }

            if (user!.id === +userId) {
                const error: CustomeError = new Error(
                    "User cannot report himself!"
                );
                error.statusCode = 422;
                throw error;
            }

            const userToBeReported = await User.findByPk(userId);
            if (!userToBeReported) {
                const error: CustomeError = new Error(
                    "No user was found with this id!"
                );
                error.statusCode = 404;
                throw error;
            }
            const isReported = await user!.$has("reported", userToBeReported);
            if (isReported) {
                const error: CustomeError = new Error(
                    "You have already reported this user!"
                );
                error.statusCode = 422;
                throw error;
            }

            await db.transaction(async (transaction) => {
                await ReportedUser.create(
                    {
                        reporterId: user!.id,
                        reportedId: userId,
                        reason: args.reason ? args.reason : null,
                    },
                    {
                        transaction,
                    }
                );
            });
            return true;
        },
        ignoreReportedUser: async (
            parent: any,
            args: { userId: number },
            context: { req: CustomeRequest }
        ) => {
            const { user, authError } = context.req;
            if (authError) {
                throw authError;
            }

            if (!user?.isAdmin) {
                const error: CustomeError = new Error(
                    "Only admins can ignore reported users!"
                );
                error.statusCode = 403;
                throw error;
            }
            const userToBeIgnored = await User.findByPk(+args.userId);
            if (!userToBeIgnored) {
                const error: CustomeError = new Error(
                    "No user was found with this id!"
                );
                error.statusCode = 404;
                throw error;
            }

            const reportsTobeIgnored = await ReportedUser.findAll({
                where: {
                    reportedId: +args.userId,
                },
            });
            if (reportsTobeIgnored.length === 0) {
                const error: CustomeError = new Error(
                    "This user is not reported!"
                );
                error.statusCode = 422;
                throw error;
            }
            await db.transaction(async (transaction) => {
                await ReportedUser.destroy({
                    where: {
                        reportedId: +args.userId,
                    },
                    transaction,
                });
            });
            return true;
        },
        muteUser: async (
            parent: any,
            args: { userId: number },
            context: { req: CustomeRequest },
            info: any
        ) => {
            const { user, authError } = context.req;
            const { userId } = args;
            if (authError) {
                throw authError;
            }

            if (user!.id === +userId) {
                const error: CustomeError = new Error(
                    "User cannot mute himself!"
                );
                error.statusCode = 422;
                throw error;
            }

            const userToBeMuted = await User.findByPk(userId);
            if (!userToBeMuted) {
                const error: CustomeError = new Error(
                    "No user was found with this id!"
                );
                error.statusCode = 404;
                throw error;
            }
            const isMuted = await user!.$has("muted", userToBeMuted);
            if (isMuted) {
                const error: CustomeError = new Error(
                    "You have already muted this user!"
                );
                error.statusCode = 422;
                throw error;
            }

            await db.transaction(async (transaction) => {
                await MutedUser.create(
                    {
                        muterId: user!.id,
                        mutedId: userId,
                    },
                    {
                        transaction,
                    }
                );
            });
            return true;
        },
        unmuteUser: async (
            parent: any,
            args: { userId: number },
            context: { req: CustomeRequest }
        ) => {
            const { user, authError } = context.req;
            const { userId } = args;
            if (authError) {
                throw authError;
            }

            if (user!.id === +userId) {
                const error: CustomeError = new Error(
                    "User cannot unmute himself!"
                );
                error.statusCode = 422;
                throw error;
            }

            const userToBeUnmuted = await User.findByPk(+args.userId);
            if (!userToBeUnmuted) {
                const error: CustomeError = new Error(
                    "No user was found with this id!"
                );
                error.statusCode = 404;
                throw error;
            }

            const isMuted = await user!.$has("muted", userToBeUnmuted);
            if (!isMuted) {
                const error: CustomeError = new Error(
                    "This user is not muted!"
                );
                error.statusCode = 422;
                throw error;
            }

            await db.transaction(async (transaction) => {
                await user!.$remove("muted", userToBeUnmuted, { transaction });
            });
            return true;
        },
    },
    User: {
        followingCount: async (parent: User) => {
            return await parent.$count("following");
        },
        followersCount: async (parent: User) => {
            return await parent.$count("followers");
        },
        following: async (parent: User, args: { page: number }) => {
            return {
                totalCount: async () => {
                    return await parent.$count("following");
                },
                users: async () => {
                    const { page } = args;
                    return await parent.$get("following", {
                        offset: ((args.page || 1) - 1) * PAGE_SIZE,
                        limit: PAGE_SIZE,
                        order: [["createdAt", "DESC"]],
                    });
                },
            };
        },
        followers: async (parent: User, args: { page: number }) => {
            return {
                totalCount: async () => {
                    return await parent.$count("followers");
                },
                users: async () => {
                    const { page } = args;
                    return await parent.$get("followers", {
                        offset: ((args.page || 1) - 1) * PAGE_SIZE,
                        limit: PAGE_SIZE,
                        order: [["createdAt", "DESC"]],
                    });
                },
            };
        },
        isFollowing: async (parent: User, args: any, context: any) => {
            const { user, authError } = context.req;
            if (authError) {
                return false;
            }
            const loggedIn = user as User;
            const isFollowing = await loggedIn.$has("following", parent);
            return isFollowing;
        },
        isFollower: async (parent: User, args: any, context: any) => {
            const { user, authError } = context.req;
            if (authError) {
                return false;
            }
            const loggedIn = user as User;
            const isFollower = await loggedIn.$has("follower", parent);
            return isFollower;
        },
        tweets: async (parent: User, args: { page: number }) => {
            return {
                totalCount: async () => {
                    return await parent.$count("tweets");
                },
                tweets: async () => {
                    const { page } = args;
                    return await parent.$get("tweets", {
                        offset: ((args.page || 1) - 1) * PAGE_SIZE,
                        limit: PAGE_SIZE,
                        order: [["createdAt", "DESC"]],
                    });
                },
            };
        },
        likes: async (parent: User, args: { page: number }) => {
            return {
                totalCount: async () => {
                    return await parent.$count("likes");
                },
                tweets: async () => {
                    const { page } = args;
                    return await parent.$get("likes", {
                        offset: ((args.page || 1) - 1) * PAGE_SIZE,
                        limit: PAGE_SIZE,
                        order: [["createdAt", "DESC"]],
                    });
                },
            };
        },
        groups: async (parent: User) => {
            const groups: Group[] = await parent.$get("groups");
            const names: string[] = groups.map((group: Group) => group.name);
            return names;
        },
        permissions: async (parent: User) => {
            const groups: Group[] = await parent.$get("groups");
            const result: string[] = [];

            for (const group of groups) {
                let permissions = await group.$get("permissions");

                await permissions.forEach((permission: any) => {
                    result.push(permission.name);
                });
            }

            return result;
        },
        reportedTweets: async (
            parent: User,
            args: { page: number },
            context: any
        ) => {
            const { user, authError } = context.req;
            if (authError) {
                throw authError;
            }

            if (user!.id === parent.id) {
                return {
                    tweets: async () => {
                        return await parent.$get("reportedTweets", {
                            offset: ((args.page || 1) - 1) * PAGE_SIZE,
                            limit: PAGE_SIZE,
                        });
                    },
                    totalCount: async () => {
                        return await parent.$count("reportedTweets");
                    },
                };
            } else {
                const error: CustomeError = new Error(
                    "User cannot see the tweets which other users have reported!"
                );
                error.statusCode = 403;
                throw error;
            }
        },
        reportedBy: async (
            parent: User,
            args: { page: number },
            context: { req: CustomeRequest }
        ) => {
            const { user, authError } = context.req;
            if (authError) {
                throw authError;
            }
            if (!user!.isAdmin) {
                const error: CustomeError = new Error(
                    "User must be an admin to get the users reporting this user!"
                );
                error.statusCode = 403;
                throw error;
            }
            return {
                users: async () => {
                    return await parent.$get("reportedBy", {
                        offset: ((args.page || 1) - 1) * PAGE_SIZE,
                        limit: PAGE_SIZE,
                    });
                },
                totalCount: async () => {
                    return await parent.$count("reportedBy");
                },
            };
        },
        reported: async (
            parent: User,
            args: { page: number },
            context: any
        ) => {
            const { user, authError } = context.req;
            if (authError) {
                throw authError;
            }

            if (user!.id === parent.id) {
                return {
                    users: async () => {
                        return await parent.$get("reported", {
                            offset: ((args.page || 1) - 1) * PAGE_SIZE,
                            limit: PAGE_SIZE,
                        });
                    },
                    totalCount: async () => {
                        return await parent.$count("reported");
                    },
                };
            } else {
                const error: CustomeError = new Error(
                    "User cannot see what other users have reported!"
                );
                error.statusCode = 403;
                throw error;
            }
        },
        muted: async (parent: User, args: { page: number }, context: any) => {
            const { user, authError } = context.req;
            if (authError) {
                throw authError;
            }

            if (user!.id === parent.id) {
                return {
                    users: async () => {
                        return await parent.$get("muted", {
                            offset: ((args.page || 1) - 1) * PAGE_SIZE,
                            limit: PAGE_SIZE,
                        });
                    },
                    totalCount: async () => {
                        return await parent.$count("muted");
                    },
                };
            } else {
                const error: CustomeError = new Error(
                    "User cannot see what other users activities!"
                );
                error.statusCode = 403;
                throw error;
            }
        },
    },
};
