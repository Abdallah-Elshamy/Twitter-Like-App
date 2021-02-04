import { expect } from "chai";
import request from "supertest";
import app, { serverPromise } from "../app";
import { User, Tweet, Hashtag } from "../models";
import db from "../db";

import {
    createTweet,
    createTweetWithMedia,
    createReply,
    deleteTweet,
    getTweet,
    getTweets,
    createRetweet,
    createQuotedRetweet,
    createQuotedRetweetWithMedia,
    getFeed,
    getFeedWithPagination,
} from "./requests/tweet-resolvers";
import { createUser, login } from "./requests/user-resolvers";
import { truncate } from "fs/promises";

let server: any;

const failCreateTweetValidation = async (
    text: string,
    message: string,
    value: string,
    token: string
) => {
    const response = await createTweet(text, token);
    expect(response.body.errors).to.has.length(1);
    expect(response.body.errors[0]).to.include({
        message: "Validation error!",
        statusCode: 422,
    });
    expect(response.body.errors[0].validators).to.has.length(1);
    expect(response.body.errors[0].validators[0]).to.include({
        message,
        value,
    });
};

const succeedCreateReply = async (
    repliedToTweetId: number,
    threadTweet: number,
    text: string,
    state: string,
    id: number,
    token: string
) => {
    const repliedToTweet: any = await Tweet.findByPk(repliedToTweetId);
    let replies = await repliedToTweet.getReplies();
    expect(replies).to.has.length(0);
    const response = await createReply(text, repliedToTweetId, token);
    expect(response.body.data.createReply).to.include({
        id: "" + id,
        text,
        state,
    });
    replies = await repliedToTweet.getReplies();
    expect(replies).to.has.length(1);
    expect(replies[0].dataValues).to.include({
        id,
        text,
        state,
        repliedToTweet: repliedToTweetId,
        threadTweet,
    });
    expect(response.body.data.createReply.mediaURLs).to.has.length(0);
};

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

const createDifferentTypesOfTweets = async (userId: number = 1) => {
    const tweets = [];
    tweets.push(...(await createTweets(userId, "O", 10)));
    tweets.push(...(await createTweets(userId, "R", 10)));
    tweets.push(...(await createTweets(userId, "Q", 4)));
    tweets.push(...(await createTweets(userId, "C", 6)));
    return tweets;
};

const createHashtags = async () => {
    const hashtags = [];
    for (let i = 0; i < 30; i++) {
        hashtags.push(
            await Hashtag.create({
                word: `test${i}`,
            })
        );
    }
    return hashtags;
};

describe("tweet-resolvers", (): void => {
    before(async () => {
        server = await serverPromise;
        await server.close();
        await server.listen();
    });

    describe("createTweet Mutation", () => {
        let token = "";
        before(async () => {
            await db.sync({ force: true });
            await createUser("omarabdo997", "omar ali");
            const response = await login("omarabdo997", "myPrecious");
            token = response.body.data.login.token;
        });
        it("createTweet with no media", async () => {
            const response = await createTweet("hello world", token);
            expect(response.body.data.createTweet).to.include({
                id: "1",
                text: "hello world",
                state: "O",
            });
            expect(response.body.data.createTweet.mediaURLs).to.has.length(0);
        });

        it("createTweet with media", async () => {
            const response = await createTweetWithMedia("hello world", token);
            expect(response.body.data.createTweet).to.include({
                id: "2",
                text: "hello world",
                state: "O",
            });
            expect(response.body.data.createTweet.mediaURLs).to.has.length(4);
            expect(response.body.data.createTweet.mediaURLs).to.include(
                "https://www.vapulus.com/en/wp-content/uploads/2019/05/startup-books.jpg"
            );
            expect(response.body.data.createTweet.mediaURLs).to.include(
                "https://media.btech.com/media/catalog/product/cache/22b1bed05f04d71c4a848d770186c3c4/h/p/hp-notebook-15-da1885ne_ca36.jpg"
            );
            expect(response.body.data.createTweet.mediaURLs).to.include(
                "https://media.btech.com/media/catalog/product/cache/22b1bed05f04d71c4a848d770186c3c4/h/p/hp_da2001ne_1.png"
            );
            expect(response.body.data.createTweet.mediaURLs).to.include(
                "https://www.rayashop.com/media/product/fc3/hp-omen-15-en0013dx-laptop-amd-ryzen-7-4800h-15-6-inch-fhd-512gb-8gb-ram-nvidia-1660-ti-6gb-win-10-22d.jpg"
            );
        });

        it("createTweet with media and no text", async () => {
            const response = await createTweetWithMedia("", token);
            expect(response.body.data.createTweet).to.include({
                id: "3",
                text: "",
                state: "O",
            });
            expect(response.body.data.createTweet.mediaURLs).to.has.length(4);
            expect(response.body.data.createTweet.mediaURLs).to.include(
                "https://www.vapulus.com/en/wp-content/uploads/2019/05/startup-books.jpg"
            );
            expect(response.body.data.createTweet.mediaURLs).to.include(
                "https://media.btech.com/media/catalog/product/cache/22b1bed05f04d71c4a848d770186c3c4/h/p/hp-notebook-15-da1885ne_ca36.jpg"
            );
            expect(response.body.data.createTweet.mediaURLs).to.include(
                "https://media.btech.com/media/catalog/product/cache/22b1bed05f04d71c4a848d770186c3c4/h/p/hp_da2001ne_1.png"
            );
            expect(response.body.data.createTweet.mediaURLs).to.include(
                "https://www.rayashop.com/media/product/fc3/hp-omen-15-en0013dx-laptop-amd-ryzen-7-4800h-15-6-inch-fhd-512gb-8gb-ram-nvidia-1660-ti-6gb-win-10-22d.jpg"
            );
        });

        it("fail createTweet with text less than 1 char", async () => {
            await failCreateTweetValidation(
                "",
                "text length must be between 1 to 280 chars!",
                "text",
                token
            );
        });

        it("fail createTweet with text more than 280 char", async () => {
            await failCreateTweetValidation(
                ".........................................................................................................................................................................................................................................................................................",
                "text length must be between 1 to 280 chars!",
                "text",
                token
            );
        });

        it("fail createTweet with mediaURLs array of more than 4 urls and invalid urls!", async () => {
            const response = await request(app)
                .post("/graphql")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    query: `
                mutation {
                    createTweet(tweet: {
                        text: "hello world"
                        mediaURLs: ["a","b","c","d","e"]
                    }){
                        id
                    }
                }
            `,
                });
            expect(response.body).to.has.property("errors");
            expect(response.body.errors).to.has.length(1);
            expect(response.body.errors[0].validators).to.has.length(2);
            expect(response.body.errors[0].validators[0].message).to.be.equal(
                "mediaURLs array must not exceed 4 urls!"
            );
            expect(response.body.errors[0].validators[1].message).to.be.equal(
                "all mediaURLs must be valid urls!"
            );
        });

        it("fail createTweet with empty mediaURLs array and empty text", async () => {
            const response = await request(app)
                .post("/graphql")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    query: `
                mutation {
                    createTweet(tweet: {
                        text: ""
                        mediaURLs: []
                    }){
                        id
                    }
                }
            `,
                });
            expect(response.body).to.has.property("errors");
            expect(response.body.errors).to.has.length(1);
            expect(response.body.errors[0].validators).to.has.length(1);
            expect(response.body.errors[0].validators[0].message).to.be.equal(
                "text length must be between 1 to 280 chars!"
            );
        });

        it("fail createTweet authorization", async () => {
            const response = await createTweet(20);
            expect(response.body.errors).to.has.length(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 401,
            });
        });
    });

    describe("createReply Mutation", () => {
        let token = ""
        before(async () => {
            await db.sync({ force: true });
            await createUser("omarabdo997", "omar ali");
            const response = await login("omarabdo997", "myPrecious");
            token = response.body.data.login.token;
            await createTweets(1, "O", 1);
        });

        it("createReply to originalTweet", async () => {
            await succeedCreateReply(1, 1, "hello world", "C", 2, token);
        });

        it("createReply to replyTweet", async () => {
            await succeedCreateReply(2, 1, "hello world2", "C", 3, token);
        });

        it("createReply to replyTweet with deleted thread tweet", async () => {
            await Tweet.destroy({ where: { id: 1 } });
            const response = await createReply("reply tweet3", 2, token);
            const tweet = await Tweet.findByPk(4);
            expect(tweet?.id).to.be.equal(4);
            expect(tweet?.repliedToTweet).to.be.equal(2);
            expect(tweet?.threadTweet).to.be.null;
        });

        it("fail createReply to a retweeted tweet", async () => {
            const rTweet = await Tweet.create({
                text: "retweet tweet",
                userId: 1,
                state: "R",
            });
            const response = await createReply("reply tweet4", rTweet.id, token);
            expect(response.body.errors).to.has.length(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 422,
                message: "Can't reply to or like a retweeted tweet!",
            });
        });

        it("fail createReply to a non existing tweet", async () => {
            const response = await createReply("reply tweet2", 20, token);
            expect(response.body.errors).to.has.length(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 404,
                message: "No tweet was found with this id!",
            });
        });

        it("fail createReply authorization", async () => {
            const response = await createReply("reply tweet2", 1);
            expect(response.body.errors).to.has.length(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 401,
            });
        });
    });

    describe("createRetweet Mutation", () => {
        let token: string = "";
        before(async () => {
            await db.sync({ force: true });
            await createUser("omarabdo997", "omar ali");
            const response = await login("omarabdo997", "myPrecious");
            token = response.body.data.login.token;
            await createTweets(1, "O", 1);
        });

        it("succeed create retweet", async () => {
            const response = await createRetweet(1, token);
            expect(response.body.data.createRetweet).to.include({
                id: "2",
                text: "",
                state: "R",
            });
            expect(response.body.data.createRetweet.mediaURLs).to.has.length(0);
            expect(
                response.body.data.createRetweet.originalTweet.id
            ).to.be.equal("1");
        });

        it("fail createRetweet to non existing tweet", async () => {
            const response = await createRetweet(20, token);
            expect(response.body.errors).to.has.length(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 404,
                message: "No tweet was found with this id!",
            });
        });

        it("fail createRetweet of a retweeted tweet", async () => {
            const response = await createRetweet(2, token);
            expect(response.body.errors).to.has.length(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 422,
                message: "Can't retweet a retweeted tweet!",
            });
        });

        it("fail createRetweet authorization", async () => {
            const response = await createRetweet(20);
            expect(response.body.errors).to.has.length(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 401,
            });
        });
    });

    describe("createQuotedRetweet Mutation", () => {
        let token: string = "";
        before(async () => {
            await db.sync({ force: true });
            await createUser("omarabdo997", "omar ali");
            const response = await login("omarabdo997", "myPrecious");
            token = response.body.data.login.token;
            await createTweets(1, "O", 1);
        });

        it("succeed create quoted retweet without media", async () => {
            const response = await createQuotedRetweet(1, "test quoted", token);
            expect(response.body.data.createQuotedRetweet).to.include({
                id: "2",
                text: "test quoted",
                state: "Q",
            });
            expect(
                response.body.data.createQuotedRetweet.mediaURLs
            ).to.has.length(0);
            expect(
                response.body.data.createQuotedRetweet.originalTweet.id
            ).to.be.equal("1");
        });

        it("succeed create quoted retweet with media", async () => {
            const response = await createQuotedRetweetWithMedia(
                1,
                "test quoted",
                token
            );
            expect(response.body.data.createQuotedRetweet).to.include({
                id: "3",
                text: "test quoted",
                state: "Q",
            });
            expect(
                response.body.data.createQuotedRetweet.mediaURLs
            ).to.has.length(4);
            expect(response.body.data.createQuotedRetweet.mediaURLs).to.include(
                "https://www.vapulus.com/en/wp-content/uploads/2019/05/startup-books.jpg"
            );
            expect(response.body.data.createQuotedRetweet.mediaURLs).to.include(
                "https://media.btech.com/media/catalog/product/cache/22b1bed05f04d71c4a848d770186c3c4/h/p/hp-notebook-15-da1885ne_ca36.jpg"
            );
            expect(response.body.data.createQuotedRetweet.mediaURLs).to.include(
                "https://media.btech.com/media/catalog/product/cache/22b1bed05f04d71c4a848d770186c3c4/h/p/hp_da2001ne_1.png"
            );
            expect(response.body.data.createQuotedRetweet.mediaURLs).to.include(
                "https://www.rayashop.com/media/product/fc3/hp-omen-15-en0013dx-laptop-amd-ryzen-7-4800h-15-6-inch-fhd-512gb-8gb-ram-nvidia-1660-ti-6gb-win-10-22d.jpg"
            );
            expect(
                response.body.data.createQuotedRetweet.originalTweet.id
            ).to.be.equal("1");
        });

        it("fail createQuotedRetweet with no text", async () => {
            const response = await createQuotedRetweet(1, "", token);
            expect(response.body.errors).to.has.length(1);
            expect(response.body.errors[0]).to.include({
                message: "Validation error!",
                statusCode: 422,
            });
            expect(response.body.errors[0].validators).to.has.length(1);
            expect(response.body.errors[0].validators[0]).to.include({
                message: "text length must be between 1 to 280 chars!",
                value: "text",
            });
        });

        it("fail createQuotedRetweet to non existing tweet", async () => {
            const response = await createQuotedRetweet(
                20,
                "test quoted",
                token
            );
            expect(response.body.errors).to.has.length(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 404,
                message: "No tweet was found with this id!",
            });
        });

        it("fail createQuotedRetweet authorization", async () => {
            const response = await createQuotedRetweet(20, "test Quoted");
            expect(response.body.errors).to.has.length(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 401,
            });
        });
    });

    describe("deleteTweet Mutation", () => {
        let token = ""
        before(async () => {
            await db.sync({ force: true });
            await createUser("omarabdo997", "omar ali");
            await createUsers(1);
            let response = await login("omarabdo997", "myPrecious");
            token = response.body.data.login.token;
            await createTweets(1, "O", 1);
            await createTweets(2, "O", 1);
        });

        it("delete tweet", async () => {
            const tweet = await Tweet.findByPk(1);
            expect(tweet).to.be.not.null;
            const response = await deleteTweet(1, token);
            expect(response.body.data.deleteTweet).to.be.true;
            const tweet2 = await Tweet.findByPk(1);
            expect(tweet2).to.be.null;
        });

        it("fail delete tweet to non existing tweet", async () => {
            const response = await deleteTweet(20, token);
            expect(response.body.errors).to.has.length(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 404,
                message: "No tweet was found with this id!",
            });
        });

        it("fail deleteTweet authorization", async () => {
            const response = await deleteTweet(2);
            expect(response.body.errors).to.has.length(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 401,
            });
        });

        it("fail deleteTweet if user doesn't own the tweet", async () => {
            const response = await deleteTweet(2, token);
            expect(response.body.errors).to.has.length(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 403,
                message: "You don't own this tweet!"
            });
        });
    });

    describe("tweet Query", () => {
        let token = ""
        before(async () => {
            await db.sync({ force: true });
            const users = await createUsers(30);
            await createUser("omarabdo997", "omar ali");
            const response = await login("omarabdo997", "myPrecious");
            const loggedInUser = await User.findByPk(31)
            token = response.body.data.login.token;
            await createTweet("hello world", token);
            const oTweet = await Tweet.findByPk(1);
            //add likes to the created tweet
            await oTweet!.$add("likes", users);
            await oTweet!.$add("likes", loggedInUser!);
            //add replies to the created tweet
            const rTweets = await createTweets(1, "C", 24);
            await oTweet!.$add("replies", rTweets);
            //add hashtags to the created tweet
            const hashtags = await createHashtags();
            await oTweet!.$add("hashtags", hashtags);
        });

        it("tweet query", async () => {
            const response = await getTweet(1);
            expect(response.body.data.tweet).to.include({
                id: "1",
                text: "hello world",
                state: "O",
            });
            expect(response.body.data.tweet.mediaURLs).to.has.length(0);
        });

        it("tweet query get user", async () => {
            const response = await getTweet(1);
            expect(response.body.data.tweet.user).to.include({
                id: "31",
                name: "omar ali",
                userName: "omarabdo997",
                email: "bilbo_baggins@shire.com",
            });
        });

        it("tweet query get originalTweet", async () => {
            const response = await getTweet(1);
            expect(response.body.data.tweet.originalTweet).to.include({
                id: "1",
            });
        });

        it("tweet query get likes with paging", async () => {
            let response = await getTweet(1, 1);
            let likes = response.body.data.tweet.likes;
            expect(likes.totalCount).to.be.equal(31);
            expect(likes.users).to.has.length(10);
            expect(likes.users[0].id).to.be.equal("31");
            expect(likes.users[9].id).to.be.equal("22");

            response = await getTweet(1, 2);
            likes = response.body.data.tweet.likes;
            expect(likes.totalCount).to.be.equal(31);
            expect(likes.users).to.has.length(10);
            expect(likes.users[0].id).to.be.equal("21");
            expect(likes.users[9].id).to.be.equal("12");

            response = await getTweet(1, 3);
            likes = response.body.data.tweet.likes;
            expect(likes.totalCount).to.be.equal(31);
            expect(likes.users).to.has.length(10);
            expect(likes.users[0].id).to.be.equal("11");
            expect(likes.users[9].id).to.be.equal("2");

            response = await getTweet(1, 4);
            likes = response.body.data.tweet.likes;
            expect(likes.totalCount).to.be.equal(31);
            expect(likes.users).to.has.length(1);
            expect(likes.users[0].id).to.be.equal("1");
        });

        it("tweet query get likesCount", async () => {
            const response = await getTweet(1);
            expect(response.body.data.tweet.likesCount).to.be.equal(31);
        });

        it("tweet query get replies with paging", async () => {
            let response = await getTweet(1, 1, 1);
            let replies = response.body.data.tweet.replies;
            expect(replies.totalCount).to.be.equal(24);
            expect(replies.tweets).to.has.length(10);
            expect(replies.tweets[0].id).to.be.equal("2");
            expect(replies.tweets[9].id).to.be.equal("11");

            response = await getTweet(1, 1, 2);
            replies = response.body.data.tweet.replies;
            expect(replies.totalCount).to.be.equal(24);
            expect(replies.tweets).to.has.length(10);
            expect(replies.tweets[0].id).to.be.equal("12");
            expect(replies.tweets[9].id).to.be.equal("21");

            response = await getTweet(1, 1, 3);
            replies = response.body.data.tweet.replies;
            expect(replies.totalCount).to.be.equal(24);
            expect(replies.tweets).to.has.length(4);
            expect(replies.tweets[0].id).to.be.equal("22");
            expect(replies.tweets[3].id).to.be.equal("25");

            response = await getTweet(1, 1, 4);
            replies = response.body.data.tweet.replies;
            expect(replies.totalCount).to.be.equal(24);
            expect(replies.tweets).to.has.length(0);
        });

        it("tweet query get repliesCount", async () => {
            const response = await getTweet(1);
            expect(response.body.data.tweet.repliesCount).to.be.equal(24);
        });

        it("tweet query get threadTweet", async () => {
            const resOriginalTweet = await createTweet("test", token);
            const id1 = resOriginalTweet.body.data.createTweet.id; 
            const resReplyTweet = await createReply("reply1", id1, token); 
            const reply2 = await createReply(
                "reply2",
                resReplyTweet.body.data.createReply.id,
                token
            );
            const id2 = reply2.body.data.createReply.id; 
            const response = await getTweet(id2);
            expect(response.body.data.tweet.threadTweet.id).to.be.equal(id1);
        });

        it("tweet query get repliedToTweet", async () => {
            const response = await getTweet(28);
            expect(response.body.data.tweet.repliedToTweet.id).to.be.equal(
                "27"
            );
        });

        it("tweet query get isLiked", async () => {
            const response = await getTweet(1, 1, 1, 1, token); //user logged in and likes the tweet
            expect(response.body.data.tweet.isLiked).to.be.true;
            const response2 = await getTweet(1); // user not logged in
            expect(response2.body.data.tweet.isLiked).to.be.false;
            const response3 = await getTweet(28,1 ,1 ,1, token); // user logged in but doesn't like the tweet
            expect(response3.body.data.tweet.isLiked).to.be.false;
        });

        it("tweet query get hashtags", async () => {
            let response = await getTweet(1, 1, 1, 1);
            let hashtags = response.body.data.tweet.hashtags;
            expect(hashtags.totalCount).to.be.equal(30);
            expect(hashtags.hashtags).to.has.length(10);
            expect(hashtags.hashtags[0].word).to.be.equal("test0");
            expect(hashtags.hashtags[9].word).to.be.equal("test9");

            response = await getTweet(1, 1, 1, 2);
            hashtags = response.body.data.tweet.hashtags;
            expect(hashtags.totalCount).to.be.equal(30);
            expect(hashtags.hashtags).to.has.length(10);
            expect(hashtags.hashtags[0].word).to.be.equal("test10");
            expect(hashtags.hashtags[9].word).to.be.equal("test19");

            response = await getTweet(1, 1, 1, 3);
            hashtags = response.body.data.tweet.hashtags;
            expect(hashtags.totalCount).to.be.equal(30);
            expect(hashtags.hashtags).to.has.length(10);
            expect(hashtags.hashtags[0].word).to.be.equal("test20");
            expect(hashtags.hashtags[9].word).to.be.equal("test29");

            response = await getTweet(1, 1, 1, 4);
            hashtags = response.body.data.tweet.hashtags;
            expect(hashtags.totalCount).to.be.equal(30);
            expect(hashtags.hashtags).to.has.length(0);
        });

        it("fail tweet query for a non existant tweet", async () => {
            const response = await getTweet(100);
            expect(response.body.errors).to.has.length(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 404,
                message: "No tweet was found with this id!",
            });
        });
    });

    describe("tweets query", () => {
        let token = ""
        before(async () => {
            await db.sync({ force: true });
            const users = await createUsers(30);
            await createUser("omarabdo997", "omar ali");
            const response = await login("omarabdo997", "myPrecious");
            token = response.body.data.login.token;
            await createTweet("hello world", token);
            await createTweetWithMedia("hello world", token);
            const oTweet = await Tweet.findByPk(1);
            await oTweet!.$add("likes", users);
            await createDifferentTypesOfTweets(31);
        });

        it("tweets query with default filter", async () => {
            let response = await getTweets(31);
            let tweets = response.body.data.tweets;
            expect(tweets.totalCount).to.be.equal(26);
            expect(tweets.tweets).to.has.length(10);
            expect(tweets.tweets[0].id).to.be.equal("26");
            expect(tweets.tweets[0].state).to.be.equal("Q");
            expect(tweets.tweets[9].id).to.be.equal("17");
            expect(tweets.tweets[9].state).to.be.equal("R");

            response = await getTweets(31, 2);
            tweets = response.body.data.tweets;
            expect(tweets.totalCount).to.be.equal(26);
            expect(tweets.tweets).to.has.length(10);
            expect(tweets.tweets[0].id).to.be.equal("16");
            expect(tweets.tweets[0].state).to.be.equal("R");
            expect(tweets.tweets[9].id).to.be.equal("7");
            expect(tweets.tweets[9].state).to.be.equal("O");

            response = await getTweets(31, 3);
            tweets = response.body.data.tweets;
            expect(tweets.totalCount).to.be.equal(26);
            expect(tweets.tweets).to.has.length(6);
            expect(tweets.tweets[0].id).to.be.equal("6");
            expect(tweets.tweets[0].state).to.be.equal("O");
            expect(tweets.tweets[5].id).to.be.equal("1");
            expect(tweets.tweets[5].state).to.be.equal("O");

            response = await getTweets(31, 4);
            tweets = response.body.data.tweets;
            expect(tweets.totalCount).to.be.equal(26);
            expect(tweets.tweets).to.has.length(0);
        });

        it("tweets query with replies&tweets filter", async () => {
            let response = await getTweets(31, 1, "replies&tweets");
            let tweets = response.body.data.tweets;
            expect(tweets.totalCount).to.be.equal(32);
            expect(tweets.tweets).to.has.length(10);
            expect(tweets.tweets[0].id).to.be.equal("32");
            expect(tweets.tweets[0].state).to.be.equal("C");
            expect(tweets.tweets[9].id).to.be.equal("23");
            expect(tweets.tweets[9].state).to.be.equal("Q");

            response = await getTweets(31, 2, "replies&tweets");
            tweets = response.body.data.tweets;
            expect(tweets.totalCount).to.be.equal(32);
            expect(tweets.tweets).to.has.length(10);
            expect(tweets.tweets[0].id).to.be.equal("22");
            expect(tweets.tweets[0].state).to.be.equal("R");
            expect(tweets.tweets[9].id).to.be.equal("13");
            expect(tweets.tweets[9].state).to.be.equal("R");

            response = await getTweets(31, 3, "replies&tweets");
            tweets = response.body.data.tweets;
            expect(tweets.totalCount).to.be.equal(32);
            expect(tweets.tweets).to.has.length(10);
            expect(tweets.tweets[0].id).to.be.equal("12");
            expect(tweets.tweets[0].state).to.be.equal("O");
            expect(tweets.tweets[9].id).to.be.equal("3");
            expect(tweets.tweets[9].state).to.be.equal("O");

            response = await getTweets(31, 4, "replies&tweets");
            tweets = response.body.data.tweets;
            expect(tweets.totalCount).to.be.equal(32);
            expect(tweets.tweets).to.has.length(2);
            expect(tweets.tweets[0].id).to.be.equal("2");
            expect(tweets.tweets[0].state).to.be.equal("O");
            expect(tweets.tweets[1].id).to.be.equal("1");
            expect(tweets.tweets[1].state).to.be.equal("O");
        });

        it("tweets query with likes filter", async () => {
            let response = await getTweets(1, 1, "likes");
            let tweets = response.body.data.tweets;
            expect(tweets.totalCount).to.be.equal(1);
            expect(tweets.tweets).to.has.length(1);
            expect(tweets.tweets[0].id).to.be.equal("1");

            response = await getTweets(1, 2, "likes");
            tweets = response.body.data.tweets;
            expect(tweets.totalCount).to.be.equal(1);
            expect(tweets.tweets).to.has.length(0);
        });

        it("tweets query with media filter", async () => {
            let response = await getTweets(31, 1, "media");
            let tweets = response.body.data.tweets;
            expect(tweets.totalCount).to.be.equal(1);
            expect(tweets.tweets).to.has.length(1);
            expect(tweets.tweets[0].id).to.be.equal("2");

            response = await getTweets(31, 2, "media");
            tweets = response.body.data.tweets;
            expect(tweets.totalCount).to.be.equal(1);
            expect(tweets.tweets).to.has.length(0);
        });

        it("fail tweets query for a non existing user", async () => {
            const response = await getTweets(100);
            expect(response.body.errors).to.has.length(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 404,
                message: "No user was found with this id!",
            });
        });

        it("fail tweets query for a non valid filter", async () => {
            const response = await getTweets(1, 2, "test");
            expect(response.body.errors).to.has.length(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 422,
                message:
                    "Filter must be null or media or replies&tweets or likes only!",
            });
        });
    });

    describe("getFeed Query", (): void => {
        let token: string = "";
        before(async () => {
            await db.sync({ force: true });
            let response = await createUser("Luffy11", "Monkey D. Luffy");
            const userId: number = response.body.data.createUser.id;
            const loggedUser = await User.findByPk(userId);

            response = await login("Luffy11", "myPrecious");
            token = response.body.data.login.token;

            const toBeFollowed: User[] = [];
            for (let i = 0; i < 2; i++) {
                let user = await User.create({
                    name: `testUser ${i + 1}`,
                    userName: `testU${i + 1}`,
                    email: `testU${i + 1}@yahoo.com`,
                    hashedPassword: "12345678910",
                    birthDate: "1970-01-01"
                });
                toBeFollowed.push(user);
            }

            await Tweet.create({
                text: "This is the first tweet",
                userId: 2,
                mediaURLs: [],
                state: "O",
            });
            for (let i = 0; i < 12; i++) {
                await Tweet.create({
                    text: `Today is a good day ${i + 1}`,
                    userId: 2,
                    mediaURLs: [],
                    state: "O",
                });
            }
            await Tweet.create({
                text: "This is the last tweet",
                userId: 3,
                mediaURLs: [],
                state: "O",
            });
            await loggedUser!.$add("following", toBeFollowed[0]);
            await loggedUser!.$add("following", toBeFollowed[1]);
        });

        it("succeeds in fetching tweets of followed users", async () => {
            const response = await getFeed(token);

            expect(response.body.data.getFeed).to.has.length(10);
            expect(response.body.data.getFeed[0]).to.include({
                text: "This is the last tweet",
            });
            expect(response.body.data.getFeed[0].user).to.have.property(
                "id",
                "3"
            );
        });
        it("succeeds in fetching paginated tweets of followed users", async () => {
            const response = await getFeedWithPagination(2, token);
            expect(response.body.data.getFeed).to.has.length(4);
            expect(response.body.data.getFeed[3]).to.include({
                text: "This is the first tweet",
            });
            expect(response.body.data.getFeed[3].user).to.have.property(
                "id",
                "2"
            );
        });
        it("fails to get Feed when not authenticated", async () => {
            const response = await getFeed();
            expect(response.body.errors).to.has.length(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 401,
            });
        });
    });

    after(async () => {
        await server.close();
    });
});
