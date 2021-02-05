import { Hashtag, HasHashtag } from "../../models";
import validator from "validator";
import { fn, col } from "sequelize";

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

            return {
                totalCount: async () => {
                    return await Hashtag.count();
                },
                hashtags: async () => {
                    const trendingHashtags = await HasHashtag.findAll({
                        attributes: ["hashtag"],
                        order: [[fn("count", col("hashtag")), "DESC"]],
                        group: "hashtag",
                        offset: ((page || 1) - 1) * PAGE_SIZE,
                        limit: PAGE_SIZE,
                    });

                    const hashtags: Hashtag[] = [];
                    for (let trending of trendingHashtags) {
                        let hashtag = await Hashtag.findOne({
                            where: { word: trending.hashtag },
                        });
                        hashtags.push(hashtag!);
                    }
                    return hashtags;
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
