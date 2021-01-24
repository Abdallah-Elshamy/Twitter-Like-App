import { User, Tweet } from "../../models";

export default {
    Query: {},
    Mutation: {
        unlike: async (parent: any, args: any, context: any, info: any) => {
            // assume that the loggedin user has an id of 1
            const currentUser: any = await User.findByPk(1);

            const tweet: any = await Tweet.findByPk(args.tweetId);
            if (!tweet) {
                const error: any = new Error("No tweet found with this id");
                error.statusCode = 404;
                throw error;
            }
            const  isLiked = await currentUser.hasLikes(tweet)

            // check if the entered tweet is liked by the current user
            if (!isLiked) {
                const error: any = new Error(
                    `The current user doesn't like tweet with id ${tweet.id}`
                );
                error.statusCode = 422;
                throw error;
            }
            await currentUser.$remove("likes", tweet);
            return true;
        },
    },
};
