import { Hashtag, HasHashtag } from "../../models";
import validator from "validator";
import { fn, col, Op } from "sequelize";

const PAGE_SIZE = 10;

export default {
    Query: {
        hashtag: async (
            parent: any,
            args: { word: string },
            context: any,
            info: any
        ) => {
            const word = args.word;
            if (validator.isEmpty(word)) {
                const error: any = new Error("Empty query argument!");
                error.statusCode = 422;
                throw error;
            }
            const hashtag: any = await Hashtag.findByPk(word);
            if (!hashtag) {
                const error: any = new Error(
                    "No hashtag found with this word!"
                );
                error.statusCode = 404;
                throw error;
            }

            return hashtag;
        },
        hashtags: async (parent: any, args: { page: number }) => {
            let { page } = args;

            const dateBefore2Weeks = new Date(
                Date.now() - 14 * 24 * 60 * 60 * 1000
            );
            const trendingHashtags = await HasHashtag.findAll({
                attributes: [
                    "hashtag",
                    [fn("count", col("hashtag")), "hashtagCount"],
                ],
                where: {
                    createdAt: {
                        [Op.gte]: dateBefore2Weeks,
                    },
                },
                order: [
                    [fn("count", col("hashtag")), "DESC"],
                    ["hashtag", "ASC"],
                ],
                group: "hashtag",
                offset: ((page || 1) - 1) * PAGE_SIZE,
                limit: PAGE_SIZE,
            });

            // An array that contains the trending words in a sorted way
            const sortedWords: string[] = trendingHashtags.map(
                (trendingHashtag) => trendingHashtag.hashtag
            );

            return {
                totalCount: async () => {
                    return sortedWords.length;
                },
                hashtags: async () => {
                    // this will get the trending hashtags but not sorted
                    const unsortedHashtags: Hashtag[] = await Hashtag.findAll({
                        where: { word: sortedWords },
                    });

                    const sortedHashtags: Hashtag[] = [];
                    // sort the hashtags based on the order of the sortedWords array
                    for (let hashtagWord of sortedWords) {
                        let hashtag = unsortedHashtags.find(
                            (hashtag) => hashtag.word == hashtagWord
                        );
                        sortedHashtags.push(hashtag!);
                    }
                    return sortedHashtags;
                },
            };
        },
    },
    Hashtag: {
        tweets: async (parent: any, args: { page: number }) => {
            const { page } = args;
            return {
                tweets: async () => {
                    const tweets = await parent.$get("tweets", {
                        offset: ((page || 1) - 1) * PAGE_SIZE,
                        limit: PAGE_SIZE,
                        order: [["createdAt", "DESC"]],
                    });
                    return tweets;
                },
                totalCount: async () => {
                    const count = await parent.$count("tweets");
                    return count;
                },
            };
        },
    },
};
