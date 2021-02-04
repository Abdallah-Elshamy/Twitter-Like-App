import { Tweet, Likes, User } from "../../models";
import { tweetValidator } from "../../validators";
import db from "../../db";
import { Transaction, Op } from "sequelize";
import { Request } from "express";

const PAGE_SIZE = 10;

interface CustomeError extends Error {
    statusCode?: number;
    validators?: { message: string; value: string }[];
}

interface CustomeRequest extends Request {
    user?: User;
    authError?: CustomeError;
}

const addTweetInDataBase = async (
    text: string,
    state: string,
    mediaURLs: string[],
    userId: number,
    transaction: Transaction,
    repliedToTweet: number | undefined = undefined,
    threadTweet: number | undefined = undefined,
    originalTweetId: number | undefined = undefined
) => {
    if (state !== "R") {
        const validators = tweetValidator({ text, mediaURLs });
        if (validators.length > 0) {
            const error: any = new Error("Validation error!");
            error.statusCode = 422;
            error.validators = validators;
            throw error;
        }
    }

    const tweet = await Tweet.create(
        {
            text,
            userId,
            state,
            mediaURLs,
            repliedToTweet,
            threadTweet,
        },
        { transaction }
    );
    tweet.originalTweetId = originalTweetId ? originalTweetId : tweet.id;
    await tweet.save({ transaction });
    return tweet;
};

export default {
    Query: {
        tweet: async (parent: any, args: any, context: any, info: any) => {
            const id = args.id;
            const tweet = await Tweet.findByPk(id);
            if (!tweet) {
                const error: any = new Error(
                    "No tweet was found with this id!"
                );
                error.statusCode = 404;
                throw error;
            }
            return tweet;
        },
        tweets: async (parent: any, args: any, context: any, info: any) => {
            const { userId, page, filter } = args;
            if (
                !(
                    !filter ||
                    filter === "media" ||
                    filter === "replies&tweets" ||
                    filter === "likes"
                )
            ) {
                const error: any = new Error(
                    "Filter must be null or media or replies&tweets or likes only!"
                );
                error.statusCode = 422;
                throw error;
            }
            const user = await User.findByPk(userId);
            if (!user) {
                const error: any = new Error("No user was found with this id!");
                error.statusCode = 404;
                throw error;
            }
            return {
                tweets: async () => {
                    if (!filter) {
                        return await user.$get("tweets", {
                            where: {
                                state: {
                                    [Op.ne]: "C",
                                },
                            },
                            order: [["createdAt", "DESC"]],
                            offset: ((page || 1) - 1) * PAGE_SIZE,
                            limit: PAGE_SIZE,
                        });
                    } else if (filter === "replies&tweets") {
                        return await user.$get("tweets", {
                            order: [["createdAt", "DESC"]],
                            offset: ((page || 1) - 1) * PAGE_SIZE,
                            limit: PAGE_SIZE,
                        });
                    } else if (filter === "likes") {
                        return await user.$get("likes", {
                            order: [["createdAt", "DESC"]],
                            offset: ((page || 1) - 1) * PAGE_SIZE,
                            limit: PAGE_SIZE,
                        });
                    } else if (filter === "media") {
                        return await user.$get("tweets", {
                            where: {
                                mediaURLs: {
                                    [Op.ne]: [],
                                },
                            },
                            order: [["createdAt", "DESC"]],
                            offset: ((page || 1) - 1) * PAGE_SIZE,
                            limit: PAGE_SIZE,
                        });
                    }
                },
                totalCount: async () => {
                    if (!filter) {
                        return await user.$count("tweets", {
                            where: {
                                state: {
                                    [Op.ne]: "C",
                                },
                            },
                        });
                    } else if (filter === "replies&tweets") {
                        return await user.$count("tweets");
                    } else if (filter === "likes") {
                        return await user.$count("likes");
                    } else if (filter === "media") {
                        return await user.$count("tweets", {
                            where: {
                                mediaURLs: {
                                    [Op.ne]: [],
                                },
                            },
                        });
                    }
                },
            };
        },
        getFeed: async (
            parent: any,
            args: { page: number },
            context: any,
            info: any
        ) => {
            const { user, authError } = context.req;
            if (authError) {
                throw authError;
            }
            const loggedIn = user as User;

            const { page } = args;

            const followingUsers = await loggedIn.$get("following", {
                attributes: ["id"],
            });
            const followingUsersIds = followingUsers.map((user) => user.id);
            const tweets: Tweet[] = await Tweet.findAll({
                where: { userId: { [Op.in]: followingUsersIds } },
                offset: ((page || 1) - 1) * PAGE_SIZE,
                limit: PAGE_SIZE,
                order: [["createdAt", "DESC"]],
            });

            return tweets;
        },
    },
    Mutation: {
        createTweet: async (
            parent: any,
            args: any,
            context: { req: CustomeRequest },
            info: any
        ) => {
            const { user, authError } = context.req;
            if (authError) {
                throw authError;
            }
            const { text, mediaURLs } = args.tweet;
            const tweet = await db.transaction(async (transaction) => {
                return await addTweetInDataBase(
                    text,
                    "O",
                    mediaURLs,
                    user!.id,
                    transaction
                );
            });
            return tweet;
        },

        createReply: async (
            parent: any,
            args: any,
            context: any,
            info: any
        ) => {
            //check authentication here first
            const { text, mediaURLs } = args.tweet;
            const repliedToTweetId = args.repliedToTweet;
            const repliedToTweet = await Tweet.findByPk(repliedToTweetId);
            if (!repliedToTweet) {
                const error: any = new Error(
                    "No tweet was found with this id!"
                );
                error.statusCode = 404;
                throw error;
            }
            if (repliedToTweet.state === "R") {
                const error: any = new Error(
                    "Can't reply to or like a retweeted tweet!"
                );
                error.statusCode = 422;
                throw error;
            }
            const tweet = await db.transaction(async (transaction) => {
                const tweet = await addTweetInDataBase(
                    text,
                    "C",
                    mediaURLs,
                    1,
                    transaction,
                    repliedToTweet.id,
                    repliedToTweet.threadTweet ||
                        (repliedToTweet.state === "O"
                            ? repliedToTweet.id
                            : undefined)
                );
                return tweet;
            });
            return tweet;
        },

        createRetweet: async (
            parent: any,
            args: { originalTweetId: number },
            context: { req: CustomeRequest }
        ) => {
            const { user, authError } = context.req;
            if (authError) {
                throw authError;
            }
            const originalTweetId = args.originalTweetId;
            const originalTweet = await Tweet.findByPk(originalTweetId);
            if (!originalTweet) {
                const error: CustomeError = new Error(
                    "No tweet was found with this id!"
                );
                error.statusCode = 404;
                throw error;
            }
            if (originalTweet.state === "R") {
                const error: CustomeError = new Error(
                    "Can't retweet a retweeted tweet!"
                );
                error.statusCode = 422;
                throw error;
            }
            const tweet = await db.transaction(async (transaction) =>
                addTweetInDataBase(
                    "",
                    "R",
                    [],
                    user!.id,
                    transaction,
                    undefined,
                    undefined,
                    originalTweetId
                )
            );
            return tweet;
        },

        createQuotedRetweet: async (
            parent: any,
            args: {
                originalTweetId: number;
                tweet: { text: string; mediaURLs: string[] };
            },
            context: { req: CustomeRequest }
        ) => {
            const { user, authError } = context.req;
            if (authError) {
                throw authError;
            }
            const { originalTweetId, tweet } = args;
            const originalTweet = await Tweet.findByPk(originalTweetId);
            if (!originalTweet) {
                const error: CustomeError = new Error(
                    "No tweet was found with this id!"
                );
                error.statusCode = 404;
                throw error;
            }

            return await db.transaction(async (transaction) =>
                addTweetInDataBase(
                    tweet.text,
                    "Q",
                    tweet.mediaURLs,
                    user!.id,
                    transaction,
                    undefined,
                    undefined,
                    originalTweetId
                )
            );
        },

        deleteTweet: async (
            parent: any,
            args: any,
            context: any,
            info: any
        ) => {
            //check authentication and if user owns the tweet
            const id = args.id;
            const tweet = await Tweet.findByPk(id);
            if (!tweet) {
                const error: any = new Error(
                    "No tweet was found with this id!"
                );
                error.statusCode = 404;
                throw error;
            }
            await tweet.destroy();
            return true;
        },
    },
    Tweet: {
        user: async (parent: Tweet) => {
            return await parent.$get("user");
        },
        originalTweet: async (parent: Tweet) => {
            return await parent.$get("originalTweet");
        },
        likes: async (parent: Tweet, args: any) => {
            return {
                users: async () => {
                    return await parent.$get("likes", {
                        offset: ((args.page || 1) - 1) * PAGE_SIZE,
                        limit: PAGE_SIZE,
                        order: [["createdAt", "DESC"]],
                    });
                },
                totalCount: async () => {
                    return await parent.$count("likes");
                },
            };
        },
        likesCount: async (parent: Tweet) => {
            return await parent.$count("likes");
        },
        replies: async (parent: Tweet, args: any) => {
            return {
                tweets: async () => {
                    return await parent.$get("replies", {
                        offset: ((args.page || 1) - 1) * PAGE_SIZE,
                        limit: PAGE_SIZE,
                        order: [["createdAt", "ASC"]],
                    });
                },
                totalCount: async () => {
                    return await parent.$count("replies");
                },
            };
        },
        repliesCount: async (parent: Tweet) => {
            return await parent.$count("replies");
        },
        threadTweet: async (parent: Tweet) => {
            return await parent.$get("thread");
        },
        hashtags: async (parent: Tweet, args: any) => {
            return {
                hashtags: async () => {
                    return await parent.$get("hashtags", {
                        offset: ((args.page || 1) - 1) * PAGE_SIZE,
                        limit: PAGE_SIZE,
                    });
                },
                totalCount: async () => {
                    return await parent.$count("hashtags");
                },
            };
        },
        repliedToTweet: async (parent: Tweet) => {
            return await parent.$get("repliedTo");
        },
        isLiked: async (parent: Tweet, args: any, context: any) => {
            //add logged in condition here and return null if no logged in user
            const like = await Likes.findOne({
                where: {
                    userId: 1, //this will be replaced with real logged in user
                    tweetId: parent.id,
                },
            });
            return like !== null;
        },
    },
};
