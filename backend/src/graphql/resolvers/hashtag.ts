import { Hashtag } from "../../models";
import validator from "validator";

const PAGE_SIZE = 10;

export default {
    Query: {
        hashtag: async (parent: any, args: any, context: any, info: any) => {
            const word = args.word;
            if(validator.isEmpty(word)) {
                const error: any = new Error(
                    "Empty query argument!"
                );
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
    },
    Hashtag: {
        tweets: async (parent: any, args: any) => {
            const { page } = args;
            return {
                tweets: async () => {
                    const tweets = await parent.$get("tweets", {
                        offset: (page - 1) * PAGE_SIZE || 0,
                        limit: page ? PAGE_SIZE : undefined,
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
