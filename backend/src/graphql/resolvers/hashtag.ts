import { Hashtag } from "../../models";
import validator from "validator";
import sequelize from "sequelize";

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
            const { page } = args;
            return {
                totalCount: async () => {
                    return await Hashtag.count();
                },
                hashtags: async () => {
                    let hashtags = await Hashtag.findAll({
                        offset: ((page || 1) - 1) * PAGE_SIZE,
                        limit: PAGE_SIZE,
                        order: [["word", "ASC"]],
                    });
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
