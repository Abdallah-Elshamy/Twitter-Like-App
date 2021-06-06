import { expect } from "chai";

import { serverPromise } from "../app";
import db from "../db";
import { User, Tweet, Group } from "../models";
import {
    getUser,
    createUser,
    getUsersWithoutPage,
    getUsersWithPage,
    createUserWithBio,
    createUserWithImage,
    createUserWithCoverImage,
    createUserComplete,
    createUserWithEmailPassword,
    createUserWithImages,
    createUserWithBirthDate,
    createTwentyUser,
    updateUser,
    emptyUpdateUser,
    updateUserName,
    updateUserUserName,
    updateUserEmail,
    updateUserPassword,
    updateUserImageURL,
    updateUserCoverImageURL,
    updateUserWithBirthDate,
    follow,
    followFifteenUser,
    unfollow,
    like,
    unlike,
    createTweet,
    login,
    banUser,
    unbanUser,
    reportUser,
    reportUserWithReason,
    reportedUsers,
    getUserWithOwnReports,
    getUserWithReportedBy,
    ignoreReportedUser,
    muteUser,
    unmuteUser,
} from "./requests/user-resolvers";

let server: any;

const createUsers = async (it: number = 30) => {
    const users = [];
    for (let i = 0; i < it; i++) {
        users.push(
            await User.create({
                name: `Test${i}`,
                userName: `test${i}`,
                email: `test${i}@gmail.com`,
                hashedPassword: `123456789`,
                birthDate: "1970-01-01",
            })
        );
    }
    return users;
};

const createTweets = async (
    userId: number = 3,
    state: string = "C",
    it: number = 24
) => {
    const tweets = [];
    for (let i = 0; i < it; i++) {
        tweets.push(
            await Tweet.create({
                text: `tweet${i}`,
                state,
                userId,
            })
        );
    }
    return tweets;
};

describe("user-resolvers", (): void => {
    before(async () => {
        server = await serverPromise;
        server.close();
        server.listen();
    });

    describe("user/users resolver", () => {
        before(async () => {
            await db.sync({ force: true });
            await createTwentyUser();
            const response = await login("kage1", "hidden_leaf");
            const token = response.body.data.login.token;
            await followFifteenUser(token);

            // get followed by fifteen users
            const toBeFollowed = await User.findByPk(1);
            for (let i: number = 2; i <= 16; i++) {
                let currentUser = await User.findByPk(i);
                if (currentUser) {
                    await db.transaction(async (transaction) => {
                        await currentUser!.$add("following", toBeFollowed!);
                    });
                }
            }
            // Create a tweet and like it
            await createTweet(token);
            await like(1, token);
        });

        it("get a user", async () => {
            const response = await getUser(1);
            // check basic properties
            expect(response.body.data.user).to.include({
                id: "1",
                userName: "kage1",
                name: "kage bunshin no jutsu",
                email: "kage1@konoha.com",
                bio: "That is MY Ninja Way!",
                imageURL: "https://picsum.photos/200/300",
                coverImageURL: "https://picsum.photos/200/300",
                followingCount: 16,
                followersCount: 16,
                birthDate: "1970-01-01",
                isBanned: false,
            });
            // check that the followers of the followers of the user
            // are retrieved correctly
            expect(response.body.data.user.followers).to.have.property(
                "totalCount"
            );
            expect(response.body.data.user.followers.totalCount).to.be.equal(
                16
            );
            expect(response.body.data.user.followers).to.have.property("users");
            expect(response.body.data.user.followers.users).to.have.length(10);
            for (let i: number = 0; i < 10; i++) {
                expect(
                    response.body.data.user.followers.users[i]
                ).to.have.property("followers");
                expect(
                    response.body.data.user.followers.users[i].followers
                ).to.have.property("totalCount");
                expect(
                    response.body.data.user.followers.users[i].followers
                        .totalCount
                ).to.be.equal(2);
                expect(
                    response.body.data.user.followers.users[i].followers
                ).to.have.property("users");
                expect(
                    response.body.data.user.followers.users[i].followers.users
                ).to.have.length(2);
                expect(
                    response.body.data.user.followers.users[i].followers
                        .users[1]
                ).to.include({ id: "1" });
            }

            // check that the following users of the following users
            // of the user are retrieved correctly
            expect(response.body.data.user.following).to.have.property(
                "totalCount"
            );
            expect(response.body.data.user.following.totalCount).to.be.equal(
                16
            );
            expect(response.body.data.user.following).to.have.property("users");
            expect(response.body.data.user.following.users).to.have.length(10);
            for (let i: number = 0; i < 10; i++) {
                expect(
                    response.body.data.user.following.users[i]
                ).to.have.property("following");
                expect(
                    response.body.data.user.following.users[i].following
                ).to.have.property("totalCount");
                expect(
                    response.body.data.user.following.users[i].following
                        .totalCount
                ).to.be.equal(2);
                expect(
                    response.body.data.user.following.users[i].following
                ).to.have.property("users");
                expect(
                    response.body.data.user.following.users[i].following.users
                ).to.have.length(2);
                expect(
                    response.body.data.user.following.users[i].following
                        .users[1]
                ).to.include({ id: "1" });
            }

            // check the retrieval of the tweets
            expect(response.body.data.user.tweets).to.have.property(
                "totalCount"
            );
            expect(response.body.data.user.tweets.totalCount).to.be.equal(1);
            expect(response.body.data.user.tweets).to.have.property("tweets");
            expect(response.body.data.user.tweets.tweets).to.have.length(1);
            expect(response.body.data.user.tweets.tweets[0]).to.have.property(
                "text"
            );
            expect(response.body.data.user.tweets.tweets[0].text).to.be.equal(
                "One ring to rule them all"
            );

            // check the retrieval of likes
            expect(response.body.data.user.likes).to.have.property(
                "totalCount"
            );
            expect(response.body.data.user.likes.totalCount).to.be.equal(1);
            expect(response.body.data.user.likes).to.have.property("tweets");
            expect(response.body.data.user.likes.tweets).to.have.length(1);
            expect(response.body.data.user.likes.tweets[0]).to.have.property(
                "text"
            );
            expect(response.body.data.user.likes.tweets[0].text).to.be.equal(
                "One ring to rule them all"
            );
        });

        it("get a non existent user", async () => {
            const response = await getUser(0);
            expect(response.body).to.has.property("errors");
            expect(response.body.errors).to.has.length(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 404,
                message: "No user was found with this id!",
            });
        });

        it("get users without page", async () => {
            const response = await getUsersWithoutPage("ag");
            expect(response.body.data.users.totalCount).to.be.equal(20);
            expect(response.body.data.users.users).to.has.length(10);
        });

        it("get users without matching string", async () => {
            const response = await getUsersWithoutPage("q");
            expect(response.body.data.users.totalCount).to.be.equal(0);
            expect(response.body.data.users.users).to.has.length(0);
        });

        it("get users where matching string matches a group of users", async () => {
            const response = await getUsersWithoutPage("12");
            expect(response.body.data.users.totalCount).to.be.equal(1);
            expect(response.body.data.users.users).to.has.length(1);
            expect(response.body.data.users.users[0]).to.include({
                id: "12",
                userName: "kage12",
            });
        });

        it("get users within a page", async () => {
            const response = await getUsersWithPage("ag", 2);
            expect(response.body.data.users.totalCount).to.be.equal(20);
            expect(response.body.data.users.users).to.has.length(10);
        });

        it("get users with a big page number", async () => {
            const response = await getUsersWithPage("ag", 3);
            expect(response.body.data.users.totalCount).to.be.equal(20);
            expect(response.body.data.users.users).to.has.length(0);
        });

        it("get users with a search term and a big page number", async () => {
            const response = await getUsersWithPage("2", 3);
            expect(response.body.data.users.totalCount).to.be.equal(3);
            expect(response.body.data.users.users).to.has.length(0);
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
                birthDate: "1970-01-01",
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
                bio: "RUN YOU FOOLS!",
                birthDate: "1970-01-01",
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
                imageURL: "https://picsum.photos/200/300",
                birthDate: "1970-01-01",
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
                coverImageURL: "https://picsum.photos/200/300",
                birthDate: "1970-01-01",
            });
        });

        it("createUser with an existing userName", async () => {
            const response = await createUserComplete("zoro", "Roronoa Zoro");
            expect(response.body.errors[0]).to.include({
                statusCode: 422,
                message: "Validation error!",
            });
            expect(response.body.errors[0].validators[0]).to.include({
                message: "This user name is already being used!",
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
                bio: "But a hero is a guy who gives out the meat to everyone else. I want to eat the damn meat!",
                imageURL: "https://picsum.photos/200/300",
                coverImageURL: "https://picsum.photos/200/300",
                birthDate: "1970-01-01",
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
                message: "This email address is already being used!",
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

        it("createUser with an invalid birth date", async () => {
            const response = await createUserWithBirthDate("Hello");
            expect(response.body.errors[0]).to.include({
                statusCode: 422,
                message: "Validation error!",
            });
            expect(response.body.errors[0].validators[0]).to.include({
                message: "Invalid birth date!",
                value: "birthDate",
            });
        });

        it("createUser with a valid birth date but in the future", async () => {
            const response = await createUserWithBirthDate("2100-01-01");
            expect(response.body.errors[0]).to.include({
                statusCode: 422,
                message: "Validation error!",
            });
            expect(response.body.errors[0].validators[0]).to.include({
                message: "Invalid birth date!",
                value: "birthDate",
            });
        });
    });

    describe("updateUser resolver", (): void => {
        let token: string = "";
        before(async () => {
            await db.sync({ force: true });
            await createUser("Luffy11", "Monkey D. Luffy");
            const response = await login("Luffy11", "myPrecious");
            token = response.body.data.login.token;
        });

        it("succeeds in updating user info", async () => {
            const userInput = {
                name: "Alfred Einstein",
                userName: "Alfred_12",
                email: "Einstein@yahoo.com",
                password: "12345678",
                birthDate: "1879-03-14",
                bio: "This is Alfred Einstein hustlin !",
                imageURL:
                    "https://preview.redd.it/t3ikdu9pp8h41.jpg?auto=webp&s=2106d1817d77e1b55438362d11b6452b7ab77bc6",
                coverImageURL:
                    "https://preview.redd.it/t3ikdu9pp8h41.jpg?auto=webp&s=2106d1817d77e1b55438362d11b6452b7ab77bc6",
            };
            const response = await updateUser(userInput, token);

            expect(response.body.data.updateUser).to.include({
                name: "Alfred Einstein",
                userName: "Alfred_12",
                email: "einstein@yahoo.com",
                bio: "This is Alfred Einstein hustlin !",
                birthDate: "1879-03-14",
                imageURL:
                    "https://preview.redd.it/t3ikdu9pp8h41.jpg?auto=webp&s=2106d1817d77e1b55438362d11b6452b7ab77bc6",
                coverImageURL:
                    "https://preview.redd.it/t3ikdu9pp8h41.jpg?auto=webp&s=2106d1817d77e1b55438362d11b6452b7ab77bc6",
            });
        });

        it("fails to update user when not authenticated", async () => {
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
            const response = await updateUser(userInput);
            expect(response.body.errors).to.has.length(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 401,
            });
        });
        it("fails to update user info because of empty request", async () => {
            const response: any = await emptyUpdateUser(token);

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
            const response: any = await updateUserName(userInput, token);

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
            const response: any = await updateUserName(userInput, token);

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

            const response: any = await updateUserUserName(userInput, token);
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

            const response: any = await updateUserUserName(userInput, token);
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
            const response: any = await updateUserUserName(userInput, token);

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
            const response: any = await updateUserEmail(userInput, token);

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
            const response: any = await updateUserEmail(userInput, token);

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
            const response: any = await updateUserPassword(userInput, token);

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
            const response: any = await updateUserImageURL(userInput, token);

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
                userInput,
                token
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

        it("fails to update user with an invalid birth date", async () => {
            const response = await updateUserWithBirthDate("hello", token);
            expect(response.body.errors[0]).to.include({
                statusCode: 422,
                message: "Validation error!",
            });
            expect(response.body.errors[0].validators[0]).to.include({
                message: "Invalid birth date!",
                value: "birthDate",
            });
        });

        it("fails to update user with a valid birth date but in the future", async () => {
            const response = await updateUserWithBirthDate("2100-01-01", token);
            expect(response.body.errors[0]).to.include({
                statusCode: 422,
                message: "Validation error!",
            });
            expect(response.body.errors[0].validators[0]).to.include({
                message: "Invalid birth date!",
                value: "birthDate",
            });
        });
    });

    describe("like resolver", () => {
        let token = "";
        before(async () => {
            await db.sync({ force: true });
            await createUser("bilbo", "Bilbo Baggins");
            const response = await login("bilbo", "myPrecious");
            token = response.body.data.login.token;
            await createTweet(token);
        });

        it("like an unliked tweet", async () => {
            // since the table is emptied, the added tweet will have id = 1
            const response = await like(1, token);
            expect(response.body.data).to.include({
                like: true,
            });
        });

        it("fails to like a tweet when not authenticated", async () => {
            const response = await like(1);
            expect(response.body.errors).to.has.length(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 401,
            });
        });

        it("like a liked tweet", async () => {
            // This tweet is already liked from the previous test
            const response = await like(1, token);
            expect(response.body).to.has.property("errors");
            expect(response.body.errors).to.has.length(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 422,
                message: "This tweet is already liked!",
            });
        });

        it("like a non existent tweet", async () => {
            // no tweet has id = 0
            const response = await like(0, token);
            expect(response.body).to.has.property("errors");
            expect(response.body.errors).to.has.length(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 404,
                message: "No tweet was found with this id!",
            });
        });
    });

    describe("unlike resolver", () => {
        let token: string = "";
        before(async () => {
            await db.sync({ force: true });
            let likedTweet: any;
            let response = await createUser("Luffy11", "Monkey D. Luffy");
            const userId = response.body.data.createUser.id;
            const user = await User.findByPk(userId);

            response = await login("Luffy11", "myPrecious");
            token = response.body.data.login.token;

            for (let i = 0; i < 2; i++) {
                let newTweet = await Tweet.create({
                    text: "This is a test tweet written by Gollum *_* ",
                    userId: userId,
                    mediaURLs: [],
                    state: "O",
                });
                if (i === 0) likedTweet = newTweet;
            }
            await user!.$add("likes", likedTweet);
        });

        it("succeeds in unliking a liked tweet", async () => {
            const response = await unlike(1, token);
            expect(response.body.data).to.include({
                unlike: true,
            });
        });

        it("fails to unlike a tweet when not authenticated", async () => {
            const response = await unlike(1);
            expect(response.body.errors).to.has.length(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 401,
            });
        });

        it("fails to unlike a non existent tweet", async () => {
            // no tweet has an id of 0
            const response = await unlike(0, token);

            expect(response.body).to.has.property("errors");
            expect(response.body.errors).to.has.length(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 404,
                message: "No tweet was found with this id!",
            });
        });

        it("fails to unlike a tweet that isn't liked by the user", async () => {
            const response = await unlike(2, token);

            expect(response.body).to.has.property("errors");
            expect(response.body.errors).to.has.length(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 422,
                message: "The current user doesn't like this tweet",
            });
        });

        after(async () => {
            await Tweet.destroy({ where: { id: [1, 2] } });
            return await User.destroy({ where: { id: 1 } });
        });
    });

    describe("follow resolver", (): void => {
        let token: string = "";
        before(async () => {
            await db.sync({ force: true });
            await createUser("Luffy11", "Monkey D. Luffy");

            const response = await login("Luffy11", "myPrecious");
            token = response.body.data.login.token;
            await createUserWithBio("gandalf", "Gandalf The Grey");
        });

        it("follow an un-followed user", async () => {
            const response = await follow(2, token);
            expect(response.body.data).to.include({
                follow: true,
            });
        });

        it("fails to follow a user when not authenticated", async () => {
            const response = await follow(2);

            expect(response.body.errors).to.has.length(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 401,
            });
        });

        it("follow a non existent user", async () => {
            // users in database are created starting from id 1
            // no user has the id of 0
            const response = await follow(0, token);
            expect(response.body).to.has.property("errors");
            expect(response.body.errors).to.has.length(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 404,
                message: "No user was found with this id!",
            });
        });

        it("follow a followed user", async () => {
            // it is assumed that a user can't follow/unfollow himself
            const response = await follow(2, token);
            expect(response.body).to.has.property("errors");
            expect(response.body.errors).to.has.length(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 422,
                message: "This user is already followed!",
            });
        });

        it("follow your account", async () => {
            const response = await follow(1, token);

            expect(response.body).to.has.property("errors");
            expect(response.body.errors).to.has.length(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 422,
                message: "The userId and the currentUserId are the same!",
            });
        });
    });

    describe("unfollow resolver", (): void => {
        let token: string = "";
        before(async () => {
            let toBeFollowed: any;
            await db.sync({ force: true });
            let response = await createUser("Luffy11", "Monkey D. Luffy");
            const userId = response.body.data.createUser.id;
            const loggedUser = await User.findByPk(userId);

            response = await login("Luffy11", "myPrecious");
            token = response.body.data.login.token;

            // create 2 users
            for (let i = 0; i < 2; i++) {
                let user = await User.create({
                    name: `testUser ${i + 1}`,
                    userName: `testU${i + 1}`,
                    email: `testU${i + 1}@yahoo.com`,
                    hashedPassword: "12345678910",
                    birthDate: "1970-01-01",
                });
                if (i === 0) toBeFollowed = user;
            }
            // make user with id 1 follow user with id 2
            return await loggedUser!.$add("following", toBeFollowed);
        });

        it("succeeds in unfollowing a followed user", async () => {
            //  user 1 follows user 2
            const response = await unfollow(2, token);
            expect(response.body.data).to.include({
                unfollow: true,
            });
        });

        it("fails to unfollow the user himself", async () => {
            const response = await unfollow(1, token);

            expect(response.body).to.has.property("errors");
            expect(response.body.errors).to.has.length(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 422,
                message: "The user can't unfollow himself!",
            });
        });

        it("fails to unfollow a user when not authenticated", async () => {
            const response = await unfollow(2);

            expect(response.body).to.has.property("errors");
            expect(response.body.errors).to.has.length(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 401,
            });
        });
        it("fails to unfollow a non existent user", async () => {
            // users in database are created starting from id 1
            // no user has the id of 0
            const response = await unfollow(0, token);
            expect(response.body).to.has.property("errors");
            expect(response.body.errors).to.has.length(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 404,
                message: "No user was found with this id!",
            });
        });

        it("fails to unfollow a user that isn't followed by the  current user", async () => {
            // user with id 3 is not followed by user with id 1
            const response = await unfollow(3, token);

            expect(response.body).to.has.property("errors");
            expect(response.body.errors).to.has.length(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 422,
                message: "The current user is not following this user",
            });
        });
        after(async () => {
            await db.sync({ force: true });
        });
    });

    describe("banUser resolver", () => {
        let token: string;
        before(async () => {
            await db.sync({ force: true });
            await createUser("omarabdo997", "omar ali");
            const response = await login("omarabdo997", "myPrecious");
            token = response.body.data.login.token;
            await User.create({
                name: "omar ali",
                userName: "omarali997",
                email: "omarali@gmail.com",
                hashedPassword: "12345678910",
                birthDate: "1970-01-01",
            });
        });

        it("fail ban user authorization", async () => {
            const response = await banUser(2);
            expect(response.body.errors).to.has.length(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 401,
                message: "Invalid Token!",
            });
        });

        it("fail ban if user is not admin", async () => {
            const response = await banUser(2, token);
            expect(response.body.errors).to.has.length(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 403,
                message: "Only admins can ban users!",
            });
            const group = await Group.create({
                name: "admin",
            });
            const user = await User.findByPk(1);
            await user?.$add("groups", group);
            const response2 = await login("omarabdo997", "myPrecious");
            token = response2.body.data.login.token;
        });

        it("fail ban if trying to ban an admin user", async () => {
            const response = await banUser(1, token);
            expect(response.body.errors).to.has.length(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 403,
                message: "Admin user can not be banned!",
            });
        });

        it("succeed in user ban", async () => {
            let user = await User.findByPk(2);
            expect(user?.isBanned).to.be.false;
            const response = await banUser(2, token);
            expect(response.body.data.banUser).to.be.true;
            user = await User.findByPk(2);
            expect(user?.isBanned).to.be.true;
        });

        it("fail to ban a banned user", async () => {
            const response = await banUser(2, token);
            expect(response.body.errors).to.has.length(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 422,
                message: "This user is already banned!",
            });
        });

        it("fail to ban a non existing user", async () => {
            const response = await banUser(100, token);
            expect(response.body.errors).to.has.length(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 404,
                message: "No user was found with this id!",
            });
        });
    });

    describe("unbanUser resolver", () => {
        let authToken: string;
        let authTokenAdmin: string;
        before(async () => {
            await db.sync({ force: true });

            await db.sync({ force: true });
            await createUser("omarabdo997", "Omar Ali");
            const group = await Group.create({
                name: "admin",
            });
            const user = await User.findByPk(1);
            await user!.$add("groups", group);
            const response = await login("omarabdo997", "myPrecious");
            authTokenAdmin = response.body.data.login.token;

            await createUserWithBio("bilbo11", "bilbo the wise");
            const user2 = await User.findByPk(2);
            const response2 = await login("bilbo11", "myPrecious");
            authToken = response2.body.data.login.token;
            
            await User.create({
                name: "omar ali",
                userName: "omarali997",
                email: "omarali@gmail.com",
                hashedPassword: "12345678910",
                birthDate: "1970-01-01",
                isBanned: true,
            });
        });

        it("succeeds in unbanning a user", async () => {
            let user = await User.findByPk(3);
            expect(user?.isBanned).to.be.true;
            const response = await unbanUser(3, authTokenAdmin);
            expect(response.body.data.unbanUser).to.be.true;
            user = await User.findByPk(3);
            expect(user?.isBanned).to.be.false;
        });

        it("fails to  unban user with no authorization header", async () => {
            const response = await unbanUser(3);
            expect(response.body.errors).to.has.length(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 401,
                message: "Invalid Token!",
            });
        });

        it("fails to unban if user is not admin", async () => {
            const response = await unbanUser(3, authToken);
            expect(response.body.errors).to.has.length(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 403,
                message: "Only admins can unban users!",
            });
        });

        it("fails to unban a non banned user", async () => {
            const response = await unbanUser(2, authTokenAdmin);
            expect(response.body.errors).to.has.length(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 422,
                message: "This user is not banned!",
            });
        });

        it("fails to ban a non existing user", async () => {
            const response = await unbanUser(0, authTokenAdmin);
            expect(response.body.errors).to.has.length(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 404,
                message: "No user was found with this id!",
            });
        });
    });

    describe("reportUser resolver", () => {
        let token: string;
        before(async () => {
            await db.sync({ force: true });
            await createUser("Bilbo11", "Bilbo the great");
            const response = await login("Bilbo11", "myPrecious");
            token = response.body.data.login.token;
            for (let i = 0; i < 2; i++) {
                await User.create({
                    name: "omar ali",
                    userName: `omar112${i}`,
                    email: `omarali${i}@gmail.com`,
                    hashedPassword: "12345678910",
                    birthDate: "1970-01-01",
                });
            }
        });
        it("fails to report another user if user is not authenticated", async () => {
            const response = await reportUser(2);
            expect(response.body.errors).to.has.length(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 401,
                message: "Invalid Token!",
            });
        });

        it("fails to report a non existent user", async () => {
            const response = await reportUser(0, token);
            expect(response.body.errors).to.has.length(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 404,
                message: "No user was found with this id!",
            });
        });

        it("fails to report the user himself", async () => {
            const response = await reportUser(1, token);
            expect(response.body.errors).to.has.length(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 422,
                message: "User cannot report himself!",
            });
        });

        it("succeeds in reporting another user", async () => {
            const response = await reportUser(2, token);
            expect(response.body.data).to.include({
                reportUser: true,
            });
            const reportedUser = await User.findByPk(2);
            const reporterUser = await User.findByPk(1);
            const isReported = await reporterUser!.$has(
                "reported",
                reportedUser!
            );
            expect(isReported).to.be.true;
        });

        it("succeeds in reporting another user with a reason", async () => {
            const response = await reportUserWithReason(3, token);
            expect(response.body.data).to.include({
                reportUser: true,
            });
            const reportedUser = await User.findByPk(3);
            const reporterUser = await User.findByPk(1);
            const isReported = await reporterUser!.$has(
                "reported",
                reportedUser!
            );
            expect(isReported).to.be.true;
        });

        it("fails to report another user which is already reported", async () => {
            const response = await reportUser(2, token);
            expect(response.body.errors).to.has.length(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 422,
                message: "You have already reported this user!",
            });
        });
    });

    describe("ignoreReportedUser resolver", async () => {
        let authToken: string;
        let authTokenAdmin: string;
        before(async () => {
            await db.sync({ force: true });
            await createUser("Bilbo11", "Bilbo the great");
            const group = await Group.create({
                name: "admin",
            });
            const user = await User.findByPk(1);
            await user!.$add("groups", group);
            const response = await login("Bilbo11", "myPrecious");
            authTokenAdmin = response.body.data.login.token;
            await createUserWithBio("bilbo11", "bilbo the wise");
            const response2 = await login("bilbo11", "myPrecious");
            authToken = response2.body.data.login.token;
            const users = await createUsers(3);
            for (let i = 0; i < 3; i++) {
                for (let j = 2; j >= i; j--) {
                    await users[i].$add("reported", users[j]);
                }
            }
        });

        it("succeeds in ignoring a reported user", async () => {
            const response = await ignoreReportedUser(4, authTokenAdmin);
            expect(response.body.data).to.include({
                ignoreReportedUser: true,
            });
        });

        it("fails to ignore reported user if not authenticated", async () => {
            const response = await ignoreReportedUser(4);
            expect(response.body.errors).to.has.length(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 401,
                message: "Invalid Token!",
            });
        });

        it("fails to ignore reported user if not admin", async () => {
            const response = await ignoreReportedUser(4, authToken);
            expect(response.body.errors).to.has.length(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 403,
                message: "Only admins can ignore reported users!",
            });
        });

        it("fails to ignore report of a non existent user", async () => {
            const response = await ignoreReportedUser(0, authTokenAdmin);
            expect(response.body.errors).to.has.length(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 404,
                message: "No user was found with this id!",
            });
        });

        it("fails to ignore a non reported user", async () => {
            const response = await ignoreReportedUser(2, authTokenAdmin);
            expect(response.body.errors).to.has.length(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 422,
                message: "This user is not reported!",
            });
        });
    });

    describe("reportedUsers", async () => {
        let authToken: string;
        before(async () => {
            await db.sync({ force: true });
            let response = await createUser("omarabdo997", "Omar Ali");
            response = await login("omarabdo997", "myPrecious");
            authToken = response.body.data.login.token;
            const users = await createUsers(10);
            for (let i = 0; i < 10; i++) {
                for (let j = 9; j >= i; j--) {
                    await users[i].$add("reported", users[j]);
                }
            }
        });

        it("fails to get reportedUsers if not authenticated", async () => {
            const response = await reportedUsers(1);
            expect(response.body.errors).to.has.length(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 401,
                message: "Invalid Token!",
            });
        });

        it("fails to get reportedUsers  if user is not admin", async () => {
            const response = await reportedUsers(1, authToken);
            expect(response.body.errors).to.has.length(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 403,
                message: "User must be an admin to get the reported users!",
            });
            const group = await Group.create({
                name: "admin",
            });
            const user = await User.findByPk(1);
            await user?.$add("groups", group);
            const response2 = await login("omarabdo997", "myPrecious");
            authToken = response2.body.data.login.token;
        });

        it("succeeds in getting reportedUsers", async () => {
            const response = await reportedUsers(1, authToken);
            expect(response.body.data.reportedUsers).to.include({
                totalCount: 10,
            });
            expect(response.body.data.reportedUsers.users).to.has.length(10);
            expect(response.body.data.reportedUsers.users[0]).to.include({
                id: "11",
            });
            expect(response.body.data.reportedUsers.users[1]).to.include({
                id: "10",
            });
            expect(response.body.data.reportedUsers.users[2]).to.include({
                id: "9",
            });
        });
    });
    describe("get reported, reportedBy users and reportedTweets from user", async () => {
        let authToken: string;
        let authTokenAdmin: string;
        before(async () => {
            await db.sync({ force: true });
            await createUser("omarabdo997", "Omar Ali");
            const group = await Group.create({
                name: "admin",
            });
            const user = await User.findByPk(1);
            await user?.$add("groups", group);
            const response = await login("omarabdo997", "myPrecious");
            authTokenAdmin = response.body.data.login.token;

            await createUserWithBio("bilbo11", "bilbo the wise");
            const user2 = await User.findByPk(2);
            const response2 = await login("bilbo11", "myPrecious");
            authToken = response2.body.data.login.token;

            const users = await createUsers(2);
            users.push(user2!);
            const tweets = await createTweets(1, "O", 3);
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    await users[i].$add("reportedTweets", tweets[j]);
                }
            }
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (i !== j) {
                        await users[i].$add("reported", users[j]);
                    }
                }
            }
        });

        it("fails to get reporters reportedTweets from user without authorization", async () => {
            const response = await getUserWithOwnReports(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 401,
                message: "Invalid Token!",
            });
        });

        it("fails to get reportedBy from user if user is not admin", async () => {
            const response = await getUserWithReportedBy(2, authToken);
            expect(response.body.errors[0]).to.include({
                statusCode: 403,
                message:
                    "User must be an admin to get the users reporting this user!",
            });
        });

        it("fails to get reported users and reportedTweets from a user if other user is loggedIn", async () => {
            const response = await getUserWithOwnReports(3, authToken);
            expect(response.body.errors[0]).to.include({
                statusCode: 403,
                message:
                    "User cannot see the tweets which other users have reported!",
            });

            expect(response.body.errors[1]).to.include({
                statusCode: 403,
                message: "User cannot see what other users have reported!",
            });
        });

        it("succeeds in getting reportedBy from user if loggedIn user is admin", async () => {
            const response = await getUserWithReportedBy(3, authTokenAdmin);
            expect(response.body.data.user).to.include({
                name: "Test0",
            });
            expect(response.body.data.user.reportedBy).to.include({
                totalCount: 2,
            });
            expect(response.body.data.user.reportedBy.users[0]).to.include({
                userName: "test1",
            });
            expect(response.body.data.user.reportedBy.users[1]).to.include({
                userName: "bilbo11",
            });
        });

        it("succeeds in getting reported users and reportedTweets from user if the same user is loggedIn", async () => {
            const response = await getUserWithOwnReports(2, authToken);
            expect(response.body.data.user).to.include({
                name: "bilbo the wise",
            });
            expect(response.body.data.user.reportedTweets).to.include({
                totalCount: 3,
            });
            expect(response.body.data.user.reportedTweets.tweets[0]).to.include(
                {
                    text: "tweet0",
                }
            );
            expect(response.body.data.user.reported).to.include({
                totalCount: 2,
            });
            expect(response.body.data.user.reported.users[0]).to.include({
                userName: "test0",
            });
        });
    });

    describe("muteUser resolver", () => {
        let token: string;
        before(async () => {
            await db.sync({ force: true });
            await createUser("Bilbo11", "Bilbo the great");
            const response = await login("Bilbo11", "myPrecious");
            token = response.body.data.login.token;
            for (let i = 0; i < 2; i++) {
                await User.create({
                    name: "omar ali",
                    userName: `omar112${i}`,
                    email: `omarali${i}@gmail.com`,
                    hashedPassword: "12345678910",
                    birthDate: "1970-01-01",
                });
            }
        });
        it("fails to mute other user if user is not authenticated", async () => {
            const response = await muteUser(2);
            expect(response.body.errors).to.has.length(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 401,
                message: "Invalid Token!",
            });
        });

        it("fails to mute a non existent user", async () => {
            const response = await muteUser(0, token);
            expect(response.body.errors).to.has.length(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 404,
                message: "No user was found with this id!",
            });
        });

        it("fails to mute the user himself", async () => {
            const response = await muteUser(1, token);
            expect(response.body.errors).to.has.length(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 422,
                message: "User cannot mute himself!",
            });
        });

        it("succeeds in muting another user", async () => {
            const response = await muteUser(2, token);
            expect(response.body.data).to.include({
                muteUser: true,
            });
            const mutedUser = await User.findByPk(2);
            const muterUser = await User.findByPk(1);
            const isMuted = await muterUser!.$has("muted", mutedUser!);
            expect(isMuted).to.be.true;
        });

        it("fails to mute other user which is already muted", async () => {
            const response = await muteUser(2, token);
            expect(response.body.errors).to.has.length(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 422,
                message: "You have already muted this user!",
            });
        });
    });

    describe("unmuteUser resolver", () => {
        let token: string;
        before(async () => {
            await db.sync({ force: true });
            await createUser("Bilbo11", "Bilbo the great");
            const response = await login("Bilbo11", "myPrecious");
            token = response.body.data.login.token;
            const users = [];
            for (let i = 0; i < 2; i++) {
                let user = await User.create({
                    name: "omar ali",
                    userName: `omar112${i}`,
                    email: `omarali${i}@gmail.com`,
                    hashedPassword: "12345678910",
                    birthDate: "1970-01-01",
                });
                users.push(user);
            }
            const user = await User.findByPk(1);
            await user!.$add("muted", users[0]);
        });
        it("fails to unmute other user if user is not authenticated", async () => {
            const response = await unmuteUser(2);
            expect(response.body.errors).to.has.length(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 401,
                message: "Invalid Token!",
            });
        });

        it("fails to mute a non existent user", async () => {
            const response = await unmuteUser(0, token);
            expect(response.body.errors).to.has.length(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 404,
                message: "No user was found with this id!",
            });
        });

        it("fails to mute the user himself", async () => {
            const response = await unmuteUser(1, token);
            expect(response.body.errors).to.has.length(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 422,
                message: "User cannot unmute himself!",
            });
        });

        it("succeeds in unmuting another user", async () => {
            const response = await unmuteUser(2, token);
            expect(response.body.data).to.include({
                unmuteUser: true,
            });
            const mutedUser = await User.findByPk(2);
            const muterUser = await User.findByPk(1);
            const isMuted = await muterUser!.$has("muted", mutedUser!);
            expect(isMuted).to.be.false;
        });

        it("fails to mute other user which is already muted", async () => {
            const response = await unmuteUser(2, token);
            expect(response.body.errors).to.has.length(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 422,
                message: "This user is not muted!",
            });
        });
    });

    after(() => {
        server.close();
    });
});
