import { Tweet, Likes, User } from "../../models";
import { tweetValidator } from "../../validators";
import db from "../../db";
import { Transaction, Op } from "sequelize";
import { Request } from "express";
import fetch from "node-fetch";
import { backOff } from "exponential-backoff";

const PAGE_SIZE = 10;

interface CustomeError extends Error {
    statusCode?: number;
    validators?: { message: string; value: string }[];
}

interface CustomeRequest extends Request {
    user?: User;
    authError?: CustomeError;
}

export const SFWRegularCheck = async () => {
    const uncheckedTweets: Tweet[] = await Tweet.findAll({
        where: {
            isChecked: false,
        },
    });
    uncheckedTweets.forEach((tweet) => {
        SFWService(tweet);
    });
};

const SFWService = async (tweet: Tweet) => {
    const serviceUrl: string = process.env.SFW_SERVICE!;
    try {
        const serverRes = await backOff(() => fetch(serviceUrl), {
            retry: (e: any, attemptNumber: number) => {
                console.log(
                    `Trial num. ${attemptNumber} to access SFW service : ${e}`
                );
                return true;
            },
        });
        // check if the flask server is up and running
        const serverJsonRes = await serverRes.json();
        if (!serverJsonRes.success) {
            const error: any = new Error("Flask Server is down");
            throw error;
        } else {
            const { text, mediaURLs } = tweet;
            const reqBody = { text: text, mediaURLs: mediaURLs };
            const SFWRes = await fetch(serviceUrl + "safe-for-work", {
                method: "POST",
                body: JSON.stringify(reqBody),
                headers: { "Content-Type": "application/json" },
            });
            const SFWJsonRes = await SFWRes.json();
            if (!SFWJsonRes.success) {
                const message = SFWJsonRes.description
                    ? SFWJsonRes.description
                    : SFWJsonRes.message;
                const error: any = new Error(message);
                throw error;
            } else {
                const isSafe = SFWJsonRes.SFW;
                await db.transaction(async (transaction) => {
                    tweet.isChecked = true;
                    tweet.isSFW = isSafe;
                    await tweet.save({ transaction });
                });
            }
        }
    } catch (error) {
        console.log("Flask server response: " + error.message);
    }
};

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
            const error: CustomeError = new Error("Validation error!");
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
    SFWService(tweet);
    return tweet;
};

export default {
    Query: {
        tweet: async (parent: any, args: { id: number; isSFW: boolean }) => {
            const { id, isSFW } = args;
            let tweet: any = null;

            if (isSFW) {
                // Safe for work
                tweet = await Tweet.findOne({
                    where: {
                        id: id,
                        isSFW: true,
                    },
                });
            } else {
                // Not safe for work
                tweet = await Tweet.findByPk(id);
            }
            if (!tweet) {
                const error: CustomeError = new Error(
                    "No tweet was found with this id!"
                );
                error.statusCode = 404;
                throw error;
            }
            const mode = isSFW ? "SFW" : "NSFW";
            tweet.mode = mode;
            return tweet;
        },
        tweets: async (
            parent: any,
            args: {
                userId: number;
                page: number;
                filter: string;
                isSFW: boolean;
            }
        ) => {
            const { userId, page, filter, isSFW } = args;
            if (
                !(
                    !filter ||
                    filter === "media" ||
                    filter === "replies&tweets" ||
                    filter === "likes"
                )
            ) {
                const error: CustomeError = new Error(
                    "Filter must be null or media or replies&tweets or likes only!"
                );
                error.statusCode = 422;
                throw error;
            }
            const user = await User.findByPk(userId);
            if (!user) {
                const error: CustomeError = new Error(
                    "No user was found with this id!"
                );
                error.statusCode = 404;
                throw error;
            }

            const mode = isSFW ? "SFW" : "NSFW";

            return {
                tweets: async () => {
                    if (isSFW) {
                        // Safe for work
                        if (!filter) {
                            const tweets: any = await user.$get("tweets", {
                                where: {
                                    state: {
                                        [Op.ne]: "C",
                                    },
                                    isSFW: true,
                                },
                                order: [["createdAt", "DESC"]],
                                offset: ((page || 1) - 1) * PAGE_SIZE,
                                limit: PAGE_SIZE,
                            });
                            return tweets.map((tweet: any) => {
                                tweet.mode = mode;
                            });
                        } else if (filter === "replies&tweets") {
                            const tweets: any = await user.$get("tweets", {
                                where: { isSFW: true },
                                order: [["createdAt", "DESC"]],
                                offset: ((page || 1) - 1) * PAGE_SIZE,
                                limit: PAGE_SIZE,
                            });
                            return tweets.map((tweet: any) => {
                                tweet.mode = mode;
                            });
                        } else if (filter === "likes") {
                            const tweets: any = await user.$get("likes", {
                                where: { isSFW: true },
                                order: [["createdAt", "DESC"]],
                                offset: ((page || 1) - 1) * PAGE_SIZE,
                                limit: PAGE_SIZE,
                            });
                            return tweets.map((tweet: any) => {
                                tweet.mode = mode;
                            });
                        } else if (filter === "media") {
                            const tweets: any = await user.$get("tweets", {
                                where: {
                                    mediaURLs: {
                                        [Op.ne]: [],
                                    },
                                    isSFW: true,
                                },
                                order: [["createdAt", "DESC"]],
                                offset: ((page || 1) - 1) * PAGE_SIZE,
                                limit: PAGE_SIZE,
                            });
                            return tweets.map((tweet: any) => {
                                tweet.mode = mode;
                            });
                        }
                    } else {
                        // Not safe for work
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
                    }
                },
                totalCount: async () => {
                    if (isSFW) {
                        // Safe for work

                        if (!filter) {
                            return await user.$count("tweets", {
                                where: {
                                    state: {
                                        [Op.ne]: "C",
                                    },
                                    isSFW: true,
                                },
                            });
                        } else if (filter === "replies&tweets") {
                            return await user.$count("tweets", {
                                where: {
                                    isSFW: true,
                                },
                            });
                        } else if (filter === "likes") {
                            return await user.$count("likes", {
                                where: {
                                    isSFW: true,
                                },
                            });
                        } else if (filter === "media") {
                            return await user.$count("tweets", {
                                where: {
                                    mediaURLs: {
                                        [Op.ne]: [],
                                    },
                                    isSFW: true,
                                },
                            });
                        }
                    } else {
                        // Not safe for work
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
                    }
                },
            };
        },
        getFeed: async (
            parent: any,
            args: { page: number; isSFW: boolean },
            context: { req: CustomeRequest }
        ) => {
            const { user, authError } = context.req;
            if (authError) {
                throw authError;
            }
            const loggedIn = user as User;

            const { page, isSFW } = args;

            const followingUsers = await loggedIn.$get("following", {
                attributes: ["id"],
            });
            const followingUsersIds = followingUsers.map((user) => user.id);

            const mode = isSFW ? "SFW" : "NSFW";
            if (isSFW) {
                const tweets: any = await Tweet.findAll({
                    where: {
                        userId: { [Op.in]: followingUsersIds },
                        isSFW: true,
                    },
                    offset: ((page || 1) - 1) * PAGE_SIZE,
                    limit: PAGE_SIZE,
                    order: [["createdAt", "DESC"]],
                });
                return tweets.map((tweet: any) => {
                    tweet.mode = mode;
                    return tweet;
                });
            } else {
                return await Tweet.findAll({
                    where: { userId: { [Op.in]: followingUsersIds } },
                    offset: ((page || 1) - 1) * PAGE_SIZE,
                    limit: PAGE_SIZE,
                    order: [["createdAt", "DESC"]],
                });
            }
        },
    },
    Mutation: {
        createTweet: async (
            parent: any,
            args: { tweet: { text: string; mediaURLs: string[] } },
            context: { req: CustomeRequest }
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
            args: {
                tweet: { text: string; mediaURLs: string[] };
                repliedToTweet: number;
            },
            context: { req: CustomeRequest }
        ) => {
            const { user, authError } = context.req;
            if (authError) {
                throw authError;
            }
            const { text, mediaURLs } = args.tweet;
            const repliedToTweetId = args.repliedToTweet;
            const repliedToTweet = await Tweet.findByPk(repliedToTweetId);
            if (!repliedToTweet) {
                const error: CustomeError = new Error(
                    "No tweet was found with this id!"
                );
                error.statusCode = 404;
                throw error;
            }
            if (repliedToTweet.state === "R") {
                const error: CustomeError = new Error(
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
                    user!.id,
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

            const qTweet = await db.transaction(async (transaction) => {
                return addTweetInDataBase(
                    tweet.text,
                    "Q",
                    tweet.mediaURLs,
                    user!.id,
                    transaction,
                    undefined,
                    undefined,
                    originalTweetId
                );
            });
            return qTweet;
        },

        deleteTweet: async (
            parent: any,
            args: { id: number },
            context: { req: CustomeRequest }
        ) => {
            const { user, authError } = context.req;
            if (authError) {
                throw authError;
            }
            const id = args.id;
            const tweet = await Tweet.findByPk(id);
            if (!tweet) {
                const error: CustomeError = new Error(
                    "No tweet was found with this id!"
                );
                error.statusCode = 404;
                throw error;
            }
            const userHasTweet = tweet.userId === user!.id;
            if (!userHasTweet) {
                const error: CustomeError = new Error(
                    "You don't own this tweet!"
                );
                error.statusCode = 403;
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
        originalTweet: async (parent: any) => {
            const isSFW = parent.mode === "SFW" ? true : false;
            if (isSFW) {
                const tweet: any = await parent.$get("originalTweet", {
                    where: {
                        isSFW: isSFW,
                    },
                });
                tweet.mode = "SFW";
                return tweet;
            } else return await parent.$get("originalTweet");
        },
        likes: async (parent: Tweet, args: { page: number }) => {
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
        replies: async (parent: any, args: { page: number }) => {
            const isSFW = parent.mode === "SFW" ? true : false;
            if (isSFW) {
                return {
                    tweets: async () => {
                        const tweets: any = await parent.$get("replies", {
                            where: { isSFW: true },
                            offset: ((args.page || 1) - 1) * PAGE_SIZE,
                            limit: PAGE_SIZE,
                            order: [["createdAt", "ASC"]],
                        });
                        return tweets.map((tweet: any) => {
                            tweet.mode = "SFW";
                            return tweet;
                        });
                    },
                    totalCount: async () => {
                        return await parent.$count("replies", {
                            where: { isSFW: true },
                        });
                    },
                };
            } else {
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
            }
        },
        repliesCount: async (parent: any) => {
            const isSFW = parent.mode === "SFW" ? true : false;
            if (isSFW) {
                return await parent.$count("replies", {
                    where: { isSFW: true },
                });
            } else return await parent.$count("replies");
        },
        threadTweet: async (parent: any) => {
            const isSFW = parent.mode === "SFW" ? true : false;
            if (isSFW) {
                const tweet: any = await parent.$get("thread", {
                    where: { isSFW: true },
                });
                tweet.mode = "SFW";
                return tweet;
            } else return await parent.$get("thread");
        },
        hashtags: async (parent: Tweet, args: { page: number }) => {
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
        repliedToTweet: async (parent: any) => {
            const isSFW = parent.mode === "SFW" ? true : false;
            if (isSFW) {
                const tweet: any = await parent.$get("repliedTo", {
                    where: { isSFW: true },
                });
                tweet.mode = "SFW";
                return tweet;
            } else return await parent.$get("repliedTo");
        },
        isLiked: async (
            parent: Tweet,
            args: any,
            context: { req: CustomeRequest }
        ) => {
            const { user, authError } = context.req;
            if (authError) {
                return false;
            }
            const like = await Likes.findOne({
                where: {
                    userId: user!.id,
                    tweetId: parent.id,
                },
            });
            return like !== null;
        },
        retweetsCount: async (parent: Tweet) => {
            return await parent.$count("subTweets", {
                where: {
                    state: "R",
                },
            });
        },
        quotedRetweetsCount: async (parent: any) => {
            const isSFW = parent.mode === "SFW" ? true : false;
            if (isSFW) {
                return await parent.$count("subTweets", {
                    where: {
                        state: "Q",
                        isSFW: true,
                    },
                });
            } else {
                return await parent.$count("subTweets", {
                    where: {
                        state: "Q",
                    },
                });
            }
        },
    },
};
