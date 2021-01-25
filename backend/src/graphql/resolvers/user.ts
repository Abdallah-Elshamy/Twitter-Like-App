import { User, Tweet } from "../../models";
import UserValidator from "../../validators/user";

const PAGE_SIZE = 1;

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
        updateUser: async (parent: any, args: any, context: any, info: any) => {
            const { id, userInput } = args;
            const validators = UserValidator(userInput);
            if (validators.length > 0) {
                const error: any = new Error("Validation error!");
                error.statusCode = 422;
                error.validators = validators;
                throw error;
            }
            const toBeUpdatedUser: any = await User.findByPk(+id);
            // check if user exist
            if (!toBeUpdatedUser) {
                const error: any = new Error("No user was found with this id!");
                error.statusCode = 404;
                throw error;
            }
            // assume logged in user is user with id 1
            // const userId = 1;
            // if (userId !== toBeUpdatedUser.id) {
            //     const error: any = new Error("Not authorized");
            //     error.statusCode = 403;
            //     throw error;
            // }
            const {
                userName,
                email,
                password,
                name,
                imageURL,
                bio,
                coverImageURL,
            } = userInput;

            if (userName) {
                toBeUpdatedUser.userName = userName;
            }
            if (email) {
                toBeUpdatedUser.email = email.toLowerCase();
            }
            if (password) {
                toBeUpdatedUser.hashedPassword = password;
            }
            if (name) {
                toBeUpdatedUser.name = name;
            }
            if (imageURL) {
                toBeUpdatedUser.imageURL = imageURL;
            }
            if (bio) {
                toBeUpdatedUser.bio = bio;
            }
            if (coverImageURL) {
                toBeUpdatedUser.coverImageURL = coverImageURL;
            }
            const updatedUser: any = await toBeUpdatedUser.save();

            return updatedUser;
        },
    },
    User: {
        followingCount: async (parent: any) => {
            return await parent.$count("following");
        },
        followersCount: async (parent: any) => {
            return await parent.$count("followers");
        },
        following: async (parent: any, args: any) => {
            return {
                totalCount: async () => {
                    return await parent.$count("following");
                },
                users: async () => {
                    const { page } = args;
                    return await parent.$get("following", {
                        offset: (page - 1) * PAGE_SIZE || 0,
                        limit: page ? PAGE_SIZE : undefined,
                    });
                },
            };
        },
        followers: async (parent: any, args: any) => {
            return {
                totalCount: async () => {
                    return await parent.$count("followers");
                },
                users: async () => {
                    const { page } = args;
                    return await parent.$get("followers", {
                        offset: (page - 1) * PAGE_SIZE || 0,
                        limit: page ? PAGE_SIZE : undefined,
                    });
                },
            };
        },
        tweets: async (parent: any, args: any) => {
            return {
                totalCount: async () => {
                    return await parent.$count("tweets");
                },
                tweets: async () => {
                    const { page } = args;
                    return await parent.$get("tweets", {
                        offset: (page - 1) * PAGE_SIZE || 0,
                        limit: page ? PAGE_SIZE : undefined,
                    });
                },
            };
        },
        likes: async (parent: any, args: any) => {
            return {
                totalCount: async () => {
                    return await parent.$count("likes");
                },
                tweets: async () => {
                    const { page } = args;
                    return await parent.$get("likes", {
                        offset: (page - 1) * PAGE_SIZE || 0,
                        limit: page ? PAGE_SIZE : undefined,
                    });
                },
            };
        },
        groups: async (parent: any) => {
            const groups: any = await parent.$get("groups");
            let names: string[] = [];
            groups.forEach((group: any) => {
                names.push(group.name);
            });
            return names;
        },
        permissions: async (parent: any) => {
            const groups: any = await parent.$get("groups");
            const result: string[] = [];

            for (const group of groups) {
                let permissions = await group.$get("permissions");

                await permissions.forEach((permission: any) => {
                    result.push(permission.name);
                });
            }

            return result;
        },
    },
};
