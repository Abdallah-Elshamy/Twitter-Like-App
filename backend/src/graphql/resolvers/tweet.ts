import { Tweet, User, Likes } from '../../models'
import db from '../../db'

export default {
    Query: {},
    Mutation: {
        createTweet: async(parent: any, args: any, context: any, info: any) => {
            const {text, state} = args.tweet
            const transaction = await db.transaction();
            const tweet: any = await Tweet.create({
                text,
                userId: 1, //assume the logged in user is with id 1
                state,
            },{transaction})
            tweet.originalTweetId = tweet.id;
            await tweet.save({transaction});
            await transaction.commit();
            return tweet;
        }
    },    
};
