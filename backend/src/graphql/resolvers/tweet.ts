import { Tweet, Likes, User, Hashtag, ReportedTweet } from "../../models";
import { tweetValidator } from "../../validators";
import db from "../../db";
import { Transaction, Op } from "sequelize";
import { Request } from "express";
import fetch from "node-fetch";
import { backOff } from "exponential-backoff";
import { fn, col } from "sequelize";

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
    // Disable SFW checking in the test environment
    if (process.env.TEST_ENVIROMENT) {
        return;
    }

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
    if (state === "R") {
        const originalTweet = await Tweet.findOne({
            attributes: ["isChecked", "isSFW"],
            where: {
                id: originalTweetId,
            },
        });
        tweet.isChecked = originalTweet!.isChecked;
        tweet.isSFW = originalTweet!.isSFW;
        await tweet.save({ transaction });
    } else {
        SFWService(tweet);
    }

    return tweet;
};

const getHashtags = (text: string) => {
    const allRegex = /#([a-zA-Z0-9_]+)/gim;
    const numRegex = /#([0-9_]+)/gim;
    const allHashtags: string[] = [];
    const numOnlyHashtags: string[] = [];
    let match;

    // extract all hashtag like strings
    while ((match = allRegex.exec(text))) {
        allHashtags.push(match[1]);
    }
    //extract hashtags that have numbers and underscores only which is not valid
    while ((match = numRegex.exec(text))) {
        numOnlyHashtags.push(match[1]);
    }
    // filter number only hashtags from overall hashtags
    let hashtags = allHashtags.filter((x) => !numOnlyHashtags.includes(x));
    hashtags = hashtags.map((x) => x.toLowerCase());
    const uniqueHashtags = [...new Set(hashtags)];

    return uniqueHashtags;
};

const calculateAge = (dob: Date) => {
    const birthDate = new Date(dob);
    const difference = Date.now() - birthDate.getTime();
    const ageDate = new Date(difference);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
};

export default {
    Query: {
        tweet: async (
            parent: any,
            args: { id: number; isSFW: boolean },
            context: any
        ) => {
            const { id, isSFW } = args;
            let tweet: any = null;
            const loggedUser = context.req.user;
            const age = loggedUser ? calculateAge(loggedUser.birthDate) : 200;

            let mode = "";
            if (isSFW === undefined || isSFW === true || age < 18) {
                mode = "SFW";
            } else {
                mode = "NSFW";
            }

            if (mode === "SFW") {
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
            },
            context: any
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

            const loggedUser = context.req.user;
            const age = loggedUser ? calculateAge(loggedUser.birthDate) : 200;
            let mode = "";
            if (isSFW === undefined || isSFW === true || age < 18) {
                mode = "SFW";
            } else {
                mode = "NSFW";
            }

            return {
                tweets: async () => {
                    if (mode === "SFW") {
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
                            if (!tweets) {
                                return [];
                            }
                            return tweets.map((tweet: any) => {
                                tweet.mode = mode;
                                return tweet;
                            });
                        } else if (filter === "replies&tweets") {
                            const tweets: any = await user.$get("tweets", {
                                where: { isSFW: true },
                                order: [["createdAt", "DESC"]],
                                offset: ((page || 1) - 1) * PAGE_SIZE,
                                limit: PAGE_SIZE,
                            });
                            if (!tweets) {
                                return [];
                            }
                            return tweets.map((tweet: any) => {
                                tweet.mode = mode;
                                return tweet;
                            });
                        } else if (filter === "likes") {
                            const tweets: any = await user.$get("likes", {
                                where: { isSFW: true },
                                order: [["createdAt", "DESC"]],
                                offset: ((page || 1) - 1) * PAGE_SIZE,
                                limit: PAGE_SIZE,
                            });
                            if (!tweets) {
                                return [];
                            }
                            return tweets.map((tweet: any) => {
                                tweet.mode = mode;
                                return tweet;
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
                            if (!tweets) {
                                return [];
                            }
                            return tweets.map((tweet: any) => {
                                tweet.mode = mode;
                                return tweet;
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
                    if (mode === "SFW") {
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

            const { page, isSFW } = args;

            const followingUsers = await user!.$get("following", {
                attributes: ["id"],
            });
            const followingUsersIds = followingUsers.map((user) => user.id);

            const age = calculateAge(user!.birthDate);
            let mode = "";
            if (isSFW === undefined || isSFW === true || age < 18) {
                mode = "SFW";
            } else {
                mode = "NSFW";
            }
            return {
                tweets: async () => {
                    if (mode === "SFW") {
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
                totalCount: async () => {
                    if (mode === "SFW") {
                        return await Tweet.count({
                            where: {
                                userId: { [Op.in]: followingUsersIds },
                                isSFW: true,
                            },
                        });
                    } else {
                        return await Tweet.count({
                            where: {
                                userId: { [Op.in]: followingUsersIds },
                            },
                        });
                    }
                },
            };
        },
        reportedTweets: async (
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
                    "User must be an admin to get the reported tweets!"
                );
                error.statusCode = 403;
                throw error;
            }
            return {
                tweets: async () => {
                    const reportedTweets = await ReportedTweet.findAll({
                        attributes: ["tweetId"],
                        order: [[fn("count", col("reporterId")), "DESC"]],
                        group: "tweetId",
                        offset: ((page || 1) - 1) * PAGE_SIZE,
                        limit: PAGE_SIZE,
                    });
                    const sortedTweetsIds = reportedTweets.map(
                        (reportedTweet) => reportedTweet.tweetId
                    );
                    const unsortedTweets = await Tweet.findAll({
                        where: { id: sortedTweetsIds },
                    });
                    const sortedTweets: Tweet[] = [];
                    for (let tweetId of sortedTweetsIds) {
                        let tweet = unsortedTweets.find(
                            (tweet) => tweet.id == tweetId
                        );
                        sortedTweets.push(tweet!);
                    }
                    return sortedTweets;
                },
                totalCount: async () => {
                    return ReportedTweet.count({
                        distinct: true,
                        col: "tweetId",
                    });
                },
            };
        },
        NSFWTweets: async (
            parent: any,
            args: { page: number },
            context: { req: CustomeRequest }
        ) => {
            const { user, authError } = context.req;
            if (authError) {
                throw authError;
            }
            if (!user!.isAdmin) {
                const error: CustomeError = new Error(
                    "User must be an admin to get only NSFW tweets!"
                );
                error.statusCode = 403;
                throw error;
            }
            return {
                tweets: await Tweet.findAll({
                    where: {
                        isSFW: false,
                    },
                    offset: ((args.page || 1) - 1) * PAGE_SIZE,
                    limit: PAGE_SIZE,
                    order: [["createdAt", "DESC"]],
                }),
                totalCount: await Tweet.count({
                    where: {
                        isSFW: false,
                    },
                }),
            };
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
            const hashtagsArr = getHashtags(text);
            const hashtags_mapped = hashtagsArr.map((hashtag) => {
                return { word: hashtag };
            });

            const tweet = await db.transaction(async (transaction) => {
                const tweet = await addTweetInDataBase(
                    text,
                    "O",
                    mediaURLs,
                    user!.id,
                    transaction
                );
                const hashtags = await Hashtag.bulkCreate(hashtags_mapped, {
                    transaction,
                    updateOnDuplicate: ["word"],
                });
                await tweet.$add("hashtags", hashtags, { transaction });

                return tweet;
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
            const hashtagsArr = getHashtags(text);
            const hashtags_mapped = hashtagsArr.map((hashtag) => {
                return { word: hashtag };
            });

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
                const hashtags = await Hashtag.bulkCreate(hashtags_mapped, {
                    transaction,
                    updateOnDuplicate: ["word"],
                });
                await tweet.$add("hashtags", hashtags, { transaction });

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

            const hashtagsArr = getHashtags(tweet.text);
            const hashtags_mapped = hashtagsArr.map((hashtag) => {
                return { word: hashtag };
            });

            const qTweet = await db.transaction(async (transaction) => {
                const qtweet: Tweet = await addTweetInDataBase(
                    tweet.text,
                    "Q",
                    tweet.mediaURLs,
                    user!.id,
                    transaction,
                    undefined,
                    undefined,
                    originalTweetId
                );
                const hashtags = await Hashtag.bulkCreate(hashtags_mapped, {
                    transaction,
                    updateOnDuplicate: ["word"],
                });
                await qtweet.$add("hashtags", hashtags, { transaction });

                return qtweet;
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
            if (!(userHasTweet || user!.isAdmin)) {
                const error: CustomeError = new Error(
                    "You don't own this tweet!"
                );
                error.statusCode = 403;
                throw error;
            }
            await tweet.destroy();
            return true;
        },
        reportTweet: async (
            parent: any,
            args: { id: number; reason: string },
            context: { req: CustomeRequest },
            info: any
        ) => {
            const { user, authError } = context.req;
            if (authError) {
                throw authError;
            }

            const tweet = await Tweet.findByPk(+args.id);
            if (!tweet) {
                const error: CustomeError = new Error(
                    "No tweet was found with this id!"
                );
                error.statusCode = 404;
                throw error;
            }

            const isOwned = await user!.$has("tweets", tweet);
            if (isOwned) {
                const error: CustomeError = new Error(
                    "User cannot report his own tweet!"
                );
                error.statusCode = 422;
                throw error;
            }

            const isReported = await user!.$has("reportedTweets", tweet);
            if (isReported) {
                const error: CustomeError = new Error(
                    "You have already reported this tweet!"
                );
                error.statusCode = 422;
                throw error;
            }

            await db.transaction(async (transaction) => {
                await ReportedTweet.create(
                    {
                        reporterId: user!.id,
                        tweetId: args.id,
                        reason: args.reason ? args.reason : null,
                    },
                    {
                        transaction,
                    }
                );
            });
            return true;
        },
        ignoreReportedTweet: async (
            parent: any,
            args: { id: number },
            context: { req: CustomeRequest }
        ) => {
            const { user, authError } = context.req;
            if (authError) {
                throw authError;
            }

            if (!user?.isAdmin) {
                const error: CustomeError = new Error(
                    "Only admins can ignore reported tweets!"
                );
                error.statusCode = 403;
                throw error;
            }
            const tweet = await Tweet.findByPk(+args.id);
            if (!tweet) {
                const error: CustomeError = new Error(
                    "No tweet was found with this id!"
                );
                error.statusCode = 404;
                throw error;
            }

            const toBeIgnored = await ReportedTweet.findAll({
                where: {
                    tweetId: args.id,
                },
            });
            if (toBeIgnored.length === 0) {
                const error: CustomeError = new Error(
                    "This tweet is not reported!"
                );
                error.statusCode = 422;
                throw error;
            }
            await db.transaction(async (transaction) => {
                await ReportedTweet.destroy({
                    where: {
                        tweetId: args.id,
                    },
                    transaction,
                });
            });
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
                tweet && (tweet.mode = "SFW");
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
                            tweet && (tweet.mode = "SFW");
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
                tweet && (tweet.mode = "SFW");
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
                tweet && (tweet.mode = "SFW");
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
        reportedBy: async (
            parent: Tweet,
            args: { page: number },
            context: { req: CustomeRequest }
        ) => {
            const { user, authError } = context.req;
            if (authError) {
                throw authError;
            }
            if (!user?.isAdmin) {
                const error: CustomeError = new Error(
                    "User must be an admin to get the users reporting the tweet!"
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
    },
};
