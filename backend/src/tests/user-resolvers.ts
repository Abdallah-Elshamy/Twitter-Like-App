import { expect } from "chai";

import { serverPromise } from "../app";
import db from "../db";
import { Hashtag, User, Tweet } from "../models";
import {
    createUser,
    createUserWithBio,
    createUserWithImage,
    createUserWithCoverImage,
    createUserComplete,
    createUserWithEmailPassword,
    createUserWithImages,
    updateUser,
    emptyUpdateUser,
    updateUserName,
    updateUserUserName,
    updateUserEmail,
    updateUserPassword,
    updateUserImageURL,
    updateUserCoverImageURL,
    follow,
    unfollow,
    hashtag,
    unlike,
} from "./requests/user-resolvers";

let server: any;

describe("user-resolvers", (): void => {
    before(async () => {
        server = await serverPromise;
        server.close();
        server.listen();
    });

    describe("updateUser resolver", (): void => {
        let userId: number = 0;
        before(async () => {
            const user = await User.create({
                name: "Nicola Tesla",
                userName: "Tesla_890",
                hashedPassword: "123456789",
                email: "Tesla@yahoo.com",
            });
            userId = user.id;
            return user;
        });

        it("succeeds in updating user info", async () => {
            const userInput = {
                name: "Alfred Einstein",
                userName: "Alfred_12",
                email: "Einstein@yahoo.com",
                password: "12345678",
                bio: "This is Alfred Einstein hustlin !",
                imageURL:
                    "https://preview.redd.it/t3ikdu9pp8h41.jpg?auto=webp&s=2106d1817d77e1b55438362d11b6452b7ab77bc6",
                coverImageURL:
                    "https://preview.redd.it/t3ikdu9pp8h41.jpg?auto=webp&s=2106d1817d77e1b55438362d11b6452b7ab77bc6",
            };
            const response = await updateUser(userId, userInput);

            expect(response.body.data.updateUser).to.include({
                name: "Alfred Einstein",
                userName: "Alfred_12",
                email: "einstein@yahoo.com",
                bio: "This is Alfred Einstein hustlin !",
                imageURL:
                    "https://preview.redd.it/t3ikdu9pp8h41.jpg?auto=webp&s=2106d1817d77e1b55438362d11b6452b7ab77bc6",
                coverImageURL:
                    "https://preview.redd.it/t3ikdu9pp8h41.jpg?auto=webp&s=2106d1817d77e1b55438362d11b6452b7ab77bc6",
            });
        });

        it("fails to update user info because of empty request", async () => {
            const response: any = await emptyUpdateUser(userId);

            expect(response.body.errors[0]).to.include({
                statusCode: 422,
                message: "Validation error!",
            });
            expect(response.body.errors[0].validators[0]).to.include({
                message: "Empty update request!",
                value: "empty",
            });
        });

        it("fails to update user with a short(empty) name", async () => {
            const userInput = {
                name: "",
            };
            const response: any = await updateUserName(userId, userInput);

            expect(response.body.errors[0]).to.include({
                statusCode: 422,
                message: "Validation error!",
            });
            expect(response.body.errors[0].validators[0]).to.include({
                message: "name must be between 1 and 50 characters long!",
                value: "name",
            });
        });

        it("fails to update user with a long name", async () => {
            const userInput = {
                name: ".......................................................",
            };
            const response: any = await updateUserName(userId, userInput);

            expect(response.body.errors[0]).to.include({
                statusCode: 422,
                message: "Validation error!",
            });
            expect(response.body.errors[0].validators[0]).to.include({
                message: "name must be between 1 and 50 characters long!",
                value: "name",
            });
        });

        it("fails to update user with short username", async () => {
            const userInput = {
                userName: "Alf",
            };

            const response: any = await updateUserUserName(userId, userInput);
            expect(response.body.errors[0]).to.include({
                statusCode: 422,
                message: "Validation error!",
            });
            expect(response.body.errors[0].validators[0]).to.include({
                message:
                    "Username must be more than 4 characters long and can be up to 15 characters or less!",
                value: "userName",
            });
        });

        it("fails to update user with long username", async () => {
            const userInput = {
                userName: "My_nameisalfredeinstein_22",
            };

            const response: any = await updateUserUserName(userId, userInput);
            expect(response.body.errors[0]).to.include({
                statusCode: 422,
                message: "Validation error!",
            });
            expect(response.body.errors[0].validators[0]).to.include({
                message:
                    "Username must be more than 4 characters long and can be up to 15 characters or less!",
                value: "userName",
            });
        });

        it("fails to update user with invalid characters in username", async () => {
            const userInput = {
                userName: "Alfred_@!",
            };
            const response: any = await updateUserUserName(userId, userInput);

            expect(response.body.errors[0]).to.include({
                statusCode: 422,
                message: "Validation error!",
            });
            expect(response.body.errors[0].validators[0]).to.include({
                message:
                    "Username can contain only letters, numbers, and underscores—no spaces are allowed!",
                value: "userName",
            });
        });

        it("fails to update user with an empty email string", async () => {
            const userInput = {
                email: "",
            };
            const response: any = await updateUserEmail(userId, userInput);

            expect(response.body.errors[0]).to.include({
                statusCode: 422,
                message: "Validation error!",
            });
            expect(response.body.errors[0].validators[0]).to.include({
                message: "Invalid email!",
                value: "email",
            });
        });

        it("fails to update user with an invalid email format", async () => {
            const userInput = {
                email: "thisisanemail",
            };
            const response: any = await updateUserEmail(userId, userInput);

            expect(response.body.errors[0]).to.include({
                statusCode: 422,
                message: "Validation error!",
            });
            expect(response.body.errors[0].validators[0]).to.include({
                message: "Invalid email!",
                value: "email",
            });
        });

        it("fails to update user with a short password", async () => {
            const userInput = {
                password: "1234",
            };
            const response: any = await updateUserPassword(userId, userInput);

            expect(response.body.errors[0]).to.include({
                statusCode: 422,
                message: "Validation error!",
            });
            expect(response.body.errors[0].validators[0]).to.include({
                message:
                    "Password must be equal or more than 8 characters long!",
                value: "password",
            });
        });

        it("fails to update user with an invalid image URL format", async () => {
            const userInput = {
                imageURL: "ThisisaURL",
            };
            const response: any = await updateUserImageURL(userId, userInput);

            expect(response.body.errors[0]).to.include({
                statusCode: 422,
                message: "Validation error!",
            });
            expect(response.body.errors[0].validators[0]).to.include({
                message: "Invalid image URL!",
                value: "imageURL",
            });
        });

        it("fails to update user with an invalid cover image URL format", async () => {
            const userInput = {
                coverImageURL: "ThisisaURL",
            };
            const response: any = await updateUserCoverImageURL(
                userId,
                userInput
            );

            expect(response.body.errors[0]).to.include({
                statusCode: 422,
                message: "Validation error!",
            });
            expect(response.body.errors[0].validators[0]).to.include({
                message: "Invalid cover image URL!",
                value: "coverImageURL",
            });
        });

        after(async () => {
            return await User.destroy({
                where: {
                    id: userId,
                },
            });
        });
    });

    describe("unfollow resolver", (): void => {
        before(async () => {
            let loggedUser: any;
            let toBeFollowed: any;
            await db.sync({ force: true });
            // create 3 users
            for (let i = 0; i < 3; i++) {
                let user = await User.create({
                    name: `testUser ${i + 1}`,
                    userName: `testU${i + 1}`,
                    email: `testU${i + 1}@yahoo.com`,
                    hashedPassword: "12345678910",
                });
                if (i === 0) loggedUser = user;
                if (i === 1) toBeFollowed = user;
            }
            // make user with id 1 follow user with id 2
            return await loggedUser.$add("following", toBeFollowed);
        });

        it("succeeds in unfollowing a followed user", async () => {
            // we know that user 1 follows user 2
            // it is assumed in the resolver that the current loggedin user is user with id 1
            const response = await unfollow(2);
            expect(response.body.data).to.include({
                unfollow: true,
            });
        });

        it("fails to unfollow a non existent user", async () => {
            // the resolver assumes that the loggedin user is the user with id 1
            // users in database are created starting from id 1
            // no user has the id of 0
            const response = await unfollow(0);
            expect(response.body).to.has.property("errors");
            expect(response.body.errors).to.has.length(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 404,
                message: "No user found with this id",
            });
        });

        it("fails to unfollow a user that isn't followed by the  current user", async () => {
            // the resolver assumes that the loggedin user is the user with id 1
            // user with id 3 is not followed by user with id 1
            const response = await unfollow(3);

            expect(response.body).to.has.property("errors");
            expect(response.body.errors).to.has.length(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 422,
                message: "The current user is not following the user with id 3",
            });
        });

        after(async () => {
            return await User.destroy({ where: { id: [1, 2, 3] } });
        });
    });

    describe("unlike resolver", () => {
        before(async () => {
            await db.sync({ force: true });
            let likedTweet: any;
            const user = await User.create({
                name: "Zog The Defiler",
                userName: "Zog_Is_a_cool_ORC99",
                email: "Mordor@yahoo.com",
                hashedPassword: "THISISApassword!11",
            });
            for (let i = 0; i < 2; i++) {
                let newTweet = await Tweet.create({
                    text: "This is a test tweet written by Gollum *_* ",
                    userId: 1,
                    mediaURLs: [],
                    state: "O",
                });
                if (i === 0) likedTweet = newTweet;
            }
            return await user.$add("likes", likedTweet);
        });

        it("succeeds in unliking a liked tweet", async () => {
            // the resolver assumes that the loggedin user is the user with id 1
            const user: any = await User.findByPk(1);
            const response = await unlike(1);
            expect(response.body.data).to.include({
                unlike: true,
            });
        });
        it("fails to unlikes a non existent tweet", async () => {
            // no tweet has an id of 0
            const response = await unlike(0);

            expect(response.body).to.has.property("errors");
            expect(response.body.errors).to.has.length(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 404,
                message: "No tweet found with this id",
            });
        });

        it("fails to unlike a tweet that isn't liked by the user", async () => {
            const user: any = await User.findByPk(1);
            const response = await unlike(2);

            expect(response.body).to.has.property("errors");
            expect(response.body.errors).to.has.length(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 422,
                message: `The current user doesn't like tweet with id 2`,
            });
        });

        after(async () => {
            await Tweet.destroy({ where: { id: [1, 2] } });
            return await User.destroy({ where: { id: 1 } });
        });
    });

    describe("hashtag resolver", () => {
        it("succeeds in finding hashtag data", async () => {
            const newHashtag = await Hashtag.create({ word: "$TEST_HASHTAG$" });
            const response = await hashtag("$TEST_HASHTAG$");

            expect(response.body.data.hashtag).to.include({
                word: "$TEST_HASHTAG$",
            });
            expect(response.body.data.hashtag.tweets).to.include({
                totalCount: 0,
            });
            await newHashtag.destroy();
        });

        it("fails to get hashtag for empty arguments", async () => {
            const response = await hashtag("");

            expect(response.body.errors).has.length(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 422,
                message: "Empty query argument!",
            });
        });

        it("fails to get a non existent hashtag", async () => {
            const response = await hashtag(
                "4$^*^THIS_IS_A_NON_EXISTENT_HASHTAG@_@"
            );

            expect(response.body.errors).has.length(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 404,
                message: "No hashtag found with this word!",
            });
        });
    });

    describe("createUser resolver", (): void => {
        before(async () => {
            await db.sync({ force: true });
        });
        it("createUser with no bio, image, or cover image", async () => {
            const response = await createUser("bilbo", "Bilbo Baggins");
            expect(response.body.data.createUser).to.include({
                id: "1",
                userName: "bilbo",
                name: "Bilbo Baggins",
            });
        });

        it("createUser with a bio but without image or cover image", async () => {
            const response = await createUserWithBio(
                "gandalf",
                "Gandalf The Grey"
            );
            expect(response.body.data.createUser).to.include({
                id: "2",
                userName: "gandalf",
                name: "Gandalf The Grey",
            });
        });

        it("createUser with an image but without bio or cover image", async () => {
            const response = await createUserWithImage(
                "frodo",
                "Frodo Baggins"
            );
            expect(response.body.data.createUser).to.include({
                id: "3",
                userName: "frodo",
                name: "Frodo Baggins",
            });
        });

        it("createUser with a cover image but without bio or image", async () => {
            const response = await createUserWithCoverImage(
                "zoro",
                "Roronoa Zoro"
            );
            expect(response.body.data.createUser).to.include({
                id: "4",
                userName: "zoro",
                name: "Roronoa Zoro",
            });
        });

        it("createUser with an existing userName", async () => {
            const response = await createUserComplete("zoro", "Roronoa Zoro");
            expect(response.body.errors[0]).to.include({
                statusCode: 422,
                message: "Validation error!",
            });
            expect(response.body.errors[0].validators[0]).to.include({
                message: "This user name is already being used",
                value: "userName",
            });
        });

        it("createUser with cover image, bio, and image", async () => {
            const response = await createUserComplete(
                "strawhat",
                "Monkey D. Luffy"
            );
            expect(response.body.data.createUser).to.include({
                id: "5",
                userName: "strawhat",
                name: "Monkey D. Luffy",
            });
        });

        it("createUser with an existing email", async () => {
            const response = await createUserComplete(
                "sauron",
                "Lieutenant of Morgoth"
            );
            expect(response.body.errors[0]).to.include({
                statusCode: 422,
                message: "Validation error!",
            });
            expect(response.body.errors[0].validators[0]).to.include({
                message: "This email address is already being used",
                value: "email",
            });
        });

        it("createUser with a short(empty) name", async () => {
            const response = await createUser("sauron", "");
            expect(response.body.errors[0]).to.include({
                statusCode: 422,
                message: "Validation error!",
            });
            expect(response.body.errors[0].validators[0]).to.include({
                message: "name must be between 1 and 50 characters long!",
                value: "name",
            });
        });

        it("createUser with a long name", async () => {
            const response = await createUser(
                "sauron",
                "......................................................."
            );
            expect(response.body.errors[0]).to.include({
                statusCode: 422,
                message: "Validation error!",
            });
            expect(response.body.errors[0].validators[0]).to.include({
                message: "name must be between 1 and 50 characters long!",
                value: "name",
            });
        });

        it("createUser with a short userName", async () => {
            const response = await createUser("Ace", "Portgas D. Ace");
            expect(response.body.errors[0]).to.include({
                statusCode: 422,
                message: "Validation error!",
            });
            expect(response.body.errors[0].validators[0]).to.include({
                message:
                    "Username must be more than 4 characters long and can be up to 15 characters or less!",
                value: "userName",
            });
        });

        it("createUser with a long userName", async () => {
            const response = await createUser(
                "Thorin_son_of_Thrain_son_of_Thror",
                "Thorin Oakenshield"
            );
            expect(response.body.errors[0]).to.include({
                statusCode: 422,
                message: "Validation error!",
            });
            expect(response.body.errors[0].validators[0]).to.include({
                message:
                    "Username must be more than 4 characters long and can be up to 15 characters or less!",
                value: "userName",
            });
        });

        it("createUser with invalid characters in username", async () => {
            const response = await createUser(
                "$trider",
                "Aragorn Son of Arathorn"
            );
            expect(response.body.errors[0]).to.include({
                statusCode: 422,
                message: "Validation error!",
            });
            expect(response.body.errors[0].validators[0]).to.include({
                message:
                    "Username can contain only letters, numbers, and underscores—no spaces are allowed!",
                value: "userName",
            });
        });

        it("createUser with an empty string as email", async () => {
            const response = await createUserWithEmailPassword(
                "",
                "hidden_leaf"
            );
            expect(response.body.errors[0]).to.include({
                statusCode: 422,
                message: "Validation error!",
            });
            expect(response.body.errors[0].validators[0]).to.include({
                message: "Invalid email!",
                value: "email",
            });
        });

        it("createUser with an invalid email format", async () => {
            const response = await createUserWithEmailPassword(
                "helloThere",
                "hidden_leaf"
            );
            expect(response.body.errors[0]).to.include({
                statusCode: 422,
                message: "Validation error!",
            });
            expect(response.body.errors[0].validators[0]).to.include({
                message: "Invalid email!",
                value: "email",
            });
        });

        it("createUser with a short password", async () => {
            const response = await createUserWithEmailPassword(
                "naruto@konoha.com",
                "hi"
            );
            expect(response.body.errors[0]).to.include({
                statusCode: 422,
                message: "Validation error!",
            });
            expect(response.body.errors[0].validators[0]).to.include({
                message:
                    "Password must be equal or more than 8 characters long!",
                value: "password",
            });
        });

        it("createUser with an invalid image URL format", async () => {
            const response = await createUserWithImages(
                "badURL",
                "https://picsum.photos/200/300"
            );
            expect(response.body.errors[0]).to.include({
                statusCode: 422,
                message: "Validation error!",
            });
            expect(response.body.errors[0].validators[0]).to.include({
                message: "Invalid image URL!",
                value: "imageURL",
            });
        });

        it("fails to update user with an invalid cover image URL format", async () => {
            const response = await createUserWithImages(
                "https://picsum.photos/200/300",
                "badURL"
            );
            expect(response.body.errors[0]).to.include({
                statusCode: 422,
                message: "Validation error!",
            });
            expect(response.body.errors[0].validators[0]).to.include({
                message: "Invalid cover image URL!",
                value: "coverImageURL",
            });
        });
    });

    describe("follow resolver", (): void => {
        it("follow an un-followed user", async () => {
            const response = await follow(2);
            expect(response.body.data).to.include({
                follow: true,
            });
        });

        it("follow a non existent user", async () => {
            // users in database are created starting from id 1
            // no user has the id of 0
            const response = await follow(0);
            expect(response.body).to.has.property("errors");
            expect(response.body.errors).to.has.length(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 404,
                message: "No user found with this id",
            });
        });

        it("follow a followed user", async () => {
            // the resolver assumes that the logged in user is the user with id 1
            // it is assumed that a user can't follow/unfollow himself
            const response = await follow(2);
            expect(response.body).to.has.property("errors");
            expect(response.body.errors).to.has.length(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 422,
                message: "This user is already followed",
            });
        });

        it("follow your account", async () => {
            const response = await follow(1);

            expect(response.body).to.has.property("errors");
            expect(response.body.errors).to.has.length(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 422,
                message: "The userId and the currentUserId are the same",
            });
        });
    });

    after(() => {
        server.close();
    });
});
