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
            const isLiked = await currentUser.hasLikes(tweet);

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
        unfollow: async (parent: any, args: any, context: any, info: any) => {
            // assume logged in user id is 1
            const currentUser: any = await User.findByPk(1);

            // check if the entered user is found in the database
            const toBeUnfollowed: any = await User.findByPk(args.userId);
            if (!toBeUnfollowed) {
                const error: any = new Error("No user found with this id");
                error.statusCode = 404;
                throw error;
            }
            const isFollowing = await currentUser.hasFollowing(toBeUnfollowed);
            // check if the current user is following the entered user
            if (!isFollowing) {
                const error: any = new Error(
                    `The current user is not following the user with id ${toBeUnfollowed.id}`
                );
                error.statusCode = 422;
                throw error;
            }
            await currentUser.$remove("following", toBeUnfollowed);

            return true;
        },
    },
};
