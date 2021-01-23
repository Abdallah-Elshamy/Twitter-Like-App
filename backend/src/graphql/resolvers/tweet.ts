import { Tweet } from "../../models";
import { tweetValidator } from "../../validators";
import db from "../../db";
import { Transaction } from "sequelize";

const PAGE_SIZE = 10;

const addTweetInDataBase = async (
    text: string,
    state: string,
    mediaURLs: string[],
    userId: number,
    transaction: Transaction,
    repliedToTweet: number | undefined = undefined,
    threadTweet: number | undefined = undefined
) => {
    const validators = tweetValidator({ text, mediaURLs });
    if (validators.length > 0) {
        const error: any = new Error("Validation error!");
        error.statusCode = 422;
        error.validators = validators;
        throw error;
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
    tweet.originalTweetId = tweet.id;
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
                    "No tweet was found with that id!"
                );
                error.statusCode = 404;
                throw error;
            }
            return tweet;
        },
    },
    Mutation: {
        createTweet: async (
            parent: any,
            args: any,
            context: any,
            info: any
        ) => {
            //check authentication here first
            const { text, mediaURLs } = args.tweet;
            const userId = 1; //assume the logged in user is with id 1
            const tweet = await db.transaction(async (transaction) => {
                return await addTweetInDataBase(
                    text,
                    "O",
                    mediaURLs,
                    1,
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
                    "No tweet was found with that id!"
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
                    "No tweet was found with that id!"
                );
                error.statusCode = 404;
                throw error;
            }
            await tweet.destroy();
            return "Successfully deleted!";
        },
    },
    Tweet: {
        user: (parent: Tweet) => {
            return parent.$get("user");
        },
        originalTweet: (parent: Tweet) => {
            return parent.$get("originalTweet");
        },
        likes: (parent: Tweet, args: any) => {
            return {
                users: () => {
                    return parent.$get("likes", {
                        offset: ((args.page || 1) - 1) * PAGE_SIZE,
                        limit: PAGE_SIZE,
                        order: [["createdAt", "DESC"]],
                    });
                },
                totalCount: () => {
                    return parent.$count("likes");
                },
            };
        },
        likesCount: async (parent: Tweet) => {
            return parent.$count("likes");
        },
        replies: async (parent: Tweet, args: any) => {
            return {
                tweets: () => {
                    return parent.$get("replies", {
                        offset: ((args.page || 1) - 1) * PAGE_SIZE,
                        limit: PAGE_SIZE,
                        order: [["createdAt", "ASC"]],
                    });
                },
                totalCount: () => {
                    return parent.$count("replies");
                },
            };
        },
    },
};
