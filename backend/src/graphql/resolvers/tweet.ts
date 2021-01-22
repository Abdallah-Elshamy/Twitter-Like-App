import { Tweet } from '../../models'
import { tweetValidator } from '../../validators'
import db from '../../db'

export default {
    Query: {},
    Mutation: {
        createTweet: async(parent: any, args: any, context: any, info: any) => {
            //check authentication here first
            const validators = tweetValidator(args.tweet)
            if(validators.length > 0) {
                const error: any = new Error("Validation error!")
                error.statusCode = 422;
                error.validators = validators;
                throw error;
            }
            const {text, state, mediaURL} = args.tweet
            const transaction = await db.transaction();
            const tweet: any = await Tweet.create({
                text,
                userId: 1, //assume the logged in user is with id 1
                state,
                mediaURL
            },{transaction})
            tweet.originalTweetId = tweet.id;
            await tweet.save({transaction});
            await transaction.commit();
            return tweet;
        }
    },    
};
