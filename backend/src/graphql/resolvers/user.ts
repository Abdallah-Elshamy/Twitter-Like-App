import bcrypt from "bcryptjs";
import validator from "validator";

import { User, Tweet } from "../../models";
import UserValidator from "../../validators/user";
import db from "../../db";
import { Op } from "sequelize";

const PAGE_SIZE = 10;

export default {
    Query: {
        user: async (parent: any, args: any, context: any, info: any) => {
            const { id } = args;
            const user: any = await User.findByPk(+id);
            if (user) {
                return user;
            } else {
                const error: any = new Error("No user was found with this id!");
                error.statusCode = 404;
                throw error;
            }
        },
        users: async (parent: any, args: any, context: any, info: any) => {
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
            userInput.hashedPassword = await bcrypt.hash(userInput.password, 12);
            delete userInput.password;
            const user = await db.transaction(async (transaction) => {
                return await User.create(userInput, { transaction });
            });
            return user;
        },
        updateUser: async (parent: any, args: any, context: any, info: any) => {
            const { id, userInput } = args;
            const validators = UserValidator(userInput);
            if (validators.length > 0) {
                const error: any = new Error("Validation error!");
                error.statusCode = 422;
                error.validators = validators;
                throw error;
            }
            const toBeUpdatedUser: any = await User.findByPk(+id);
            // check if user exist
            if (!toBeUpdatedUser) {
                const error: any = new Error("No user was found with this id!");
                error.statusCode = 404;
                throw error;
            }
            // assume logged in user is user with id 1
            // const userId = 1;
            // if (userId !== toBeUpdatedUser.id) {
            //     const error: any = new Error("Not authorized");
            //     error.statusCode = 403;
            //     throw error;
            // }
            const {
                userName,
                email,
                password,
                name,
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
                const sanitized = validator.normalizeEmail(email);
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
        like: async (parent: any, args: any, context: any, info: any) => {
            // assume that the logged in user has an id of 1
            const currentUser: any = await User.findByPk(1);

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

            const isLiked = await currentUser.hasLikes(tweet);

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
        unlike: async (parent: any, args: any, context: any, info: any) => {
            // assume that the loggedin user has an id of 1
            const currentUser: any = await User.findByPk(1);

            const tweet: any = await Tweet.findByPk(args.tweetId);
            if (!tweet) {
                const error: any = new Error(
                    "No tweet was found with this id!"
                );
                error.statusCode = 404;
                throw error;
            }
            const isLiked = await currentUser.hasLikes(tweet);

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
        follow: async (parent: any, args: any, context: any, info: any) => {
            // assume logged in user id is 1
            const currentUserId: number = 1;
            // check if the user is trying to follow himself
            if (currentUserId === +args.userId) {
                const error: any = new Error(
                    "The userId and the currentUserId are the same!"
                );
                error.statusCode = 422;
                throw error;
            }

            const currentUser: any = await User.findByPk(currentUserId);

            // check if the entered user is found in the database
            const toBeFollowed: any = await User.findByPk(args.userId);
            if (!toBeFollowed) {
                const error: any = new Error("No user was found with this id!");
                error.statusCode = 404;
                throw error;
            }
            const isFollowing = await currentUser.hasFollowing(toBeFollowed);
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
        unfollow: async (parent: any, args: any, context: any, info: any) => {
            // assume logged in user id is 1
            const currentUser: any = await User.findByPk(1);

            // check if the entered user is found in the database
            const toBeUnfollowed: any = await User.findByPk(args.userId);
            if (!toBeUnfollowed) {
                const error: any = new Error("No user was found with this id!");
                error.statusCode = 404;
                throw error;
            }
            const isFollowing = await currentUser.hasFollowing(toBeUnfollowed);
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
    },
    User: {
        followingCount: async (parent: any) => {
            return await parent.$count("following");
        },
        followersCount: async (parent: any) => {
            return await parent.$count("followers");
        },
        following: async (parent: any, args: any) => {
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
        followers: async (parent: any, args: any) => {
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
        tweets: async (parent: any, args: any) => {
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
        likes: async (parent: any, args: any) => {
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
        groups: async (parent: any) => {
            const groups: any = await parent.$get("groups");
            const names: string[] = groups.map((group: any) => group.name);
            return names;
        },
        permissions: async (parent: any) => {
            const groups: any = await parent.$get("groups");
            const result: string[] = [];

            for (const group of groups) {
                let permissions = await group.$get("permissions");

                await permissions.forEach((permission: any) => {
                    result.push(permission.name);
                });
            }

            return result;
        },
    },
};
