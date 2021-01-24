import { expect } from "chai";
import request from "supertest";
import app, { serverPromise } from "../app";
import { User, Tweet } from "../models";
import db from "../db";

import {
    createTweet,
    createTweetWithMedia,
    createReply,
    deleteTweet,
    getTweet,
} from "./requests/tweet-resolvers";

let server: any;

const failCreateTweetValidation = async (
    text: string,
    message: string,
    value: string
) => {
    const response = await createTweet(text);
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
    id: number
) => {
    const repliedToTweet: any = await Tweet.findByPk(repliedToTweetId);
    let replies = await repliedToTweet.getReplies();
    expect(replies).to.has.length(0);
    const response = await createReply(text, repliedToTweetId);
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

const createUsers = async () => {
    const users = [];
    for (let i = 0; i < 30; i++) {
        users.push(
            await User.create({
                name: `Test${i}`,
                userName: `test${i}`,
                email: `test${i}@gmail.com`,
                hashedPassword: `123456789`,
            })
        );
    }
    return users;
};

const addLikesToTweet = async (users: User[], tweet: Tweet) => {
    const usersPromises = users.map(async (user) => {
        return await user.$add("likes", tweet);
    });
    return await Promise.all(usersPromises);
};

const createTweets = async () => {
    const tweets = [];
    for (let i = 0; i < 24; i++) {
        tweets.push(
            await Tweet.create({
                text: `reply tweet${i}`,
                state: "C",
                userId: 3,
            })
        );
    }
    return tweets;
};

describe("tweet-resolvers", (): void => {
    before(async () => {
        server = await serverPromise;
        await server.close();
        await server.listen();
        await db.sync({ force: true });
        const users = await createUsers();
    });

    it("createTweet with no media", async () => {
        const response = await createTweet("hello world");
        expect(response.body.data.createTweet).to.include({
            id: "1",
            text: "hello world",
            state: "O",
        });
        expect(response.body.data.createTweet.mediaURLs).to.has.length(0);
    });

    it("createTweet with media", async () => {
        const response = await createTweetWithMedia("hello world");
        expect(response.body.data.createTweet).to.include({
            id: "2",
            text: "hello world",
            state: "O",
        });
        expect(response.body.data.createTweet.mediaURLs).to.has.length(4);
        expect(response.body.data.createTweet.mediaURLs).to.include("a");
        expect(response.body.data.createTweet.mediaURLs).to.include("b");
        expect(response.body.data.createTweet.mediaURLs).to.include("c");
        expect(response.body.data.createTweet.mediaURLs).to.include("d");
    });

    it("fail createTweet with text less than 1 char", async () => {
        await failCreateTweetValidation(
            "",
            "text length must be between 1 to 280 chars!",
            "text"
        );
    });

    it("fail createTweet with text more than 280 char", async () => {
        await failCreateTweetValidation(
            ".........................................................................................................................................................................................................................................................................................",
            "text length must be between 1 to 280 chars!",
            "text"
        );
    });

    it("fail createTweet with mediaURLs array of more than 4 urls", async () => {
        const response = await request(app).post("/graphql").send({
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
        expect(response.body.errors[0].validators).to.has.length(1);
        expect(response.body.errors[0].validators[0].message).to.be.equal(
            "mediaURLs array must not exceed 4 urls!"
        );
    });

    it("createReply to originalTweet", async () => {
        await succeedCreateReply(1, 1, "hello world", "C", 3);
    });

    it("createReply to replyTweet", async () => {
        await succeedCreateReply(3, 1, "hello world2", "C", 4);
    });

    it("createReply to replyTweet with deleted thread tweet", async () => {
        await Tweet.destroy({ where: { id: 1 } });
        const response = await createReply("reply tweet3", 3);
        const tweet = await Tweet.findByPk(5);
        expect(tweet?.id).to.be.equal(5);
        expect(tweet?.repliedToTweet).to.be.equal(3);
        expect(tweet?.threadTweet).to.be.null;
    });

    it("fail createReply to a retweeted tweet", async () => {
        const rTweet = await Tweet.create({
            text: "retweet tweet",
            userId: 1,
            state: "R",
        });
        const response = await createReply("reply tweet4", rTweet.id);
        expect(response.body.errors).to.has.length(1);
        expect(response.body.errors[0]).to.include({
            statusCode: 422,
            message: "Can't reply to or like a retweeted tweet!",
        });
    });

    it("fail createReply to a non existing tweet", async () => {
        const response = await createReply("reply tweet2", 20);
        expect(response.body.errors).to.has.length(1);
        expect(response.body.errors[0]).to.include({
            statusCode: 404,
            message: "No tweet was found with that id!",
        });
    });

    it("delete tweet", async () => {
        const tweet = await Tweet.findByPk(4);
        expect(tweet).to.be.not.null;
        const response = await deleteTweet(4);
        expect(response.body.data.deleteTweet).to.be.equal(
            "Successfully deleted!"
        );
        const tweet2 = await Tweet.findByPk(4);
        expect(tweet2).to.be.null;
    });

    it("fail delete tweet to non existing tweet", async () => {
        const response = await deleteTweet(20);
        expect(response.body.errors).to.has.length(1);
        expect(response.body.errors[0]).to.include({
            statusCode: 404,
            message: "No tweet was found with that id!",
        });
    });

    it("get tweet query", async () => {
        const tweet = await Tweet.findByPk(3);
        const users = await User.findAll();
        await addLikesToTweet(users, tweet!);
        const response = await getTweet(3, 1, 1);
        expect(response.body.data.tweet).to.include({
            id: "3",
            text: "hello world",
            state: "C",
        });
        expect(response.body.data.tweet.mediaURLs).to.has.length(0);
    });

    it("get tweet user", async () => {
        const response = await getTweet(3, 1, 1);
        expect(response.body.data.tweet.user).to.include({
            id: "1",
            name: "Test0",
            userName: "test0",
            email: "test0@gmail.com",
        });
    });

    it("get tweet original tweet", async () => {
        const response = await getTweet(3, 1, 1);
        expect(response.body.data.tweet.originalTweet).to.include({
            id: "3",
        });
    });

    it("get tweet likes with paging", async () => {
        let response = await getTweet(3, 1, 1);
        let likes = response.body.data.tweet.likes;
        expect(likes.totalCount).to.be.equal(30);
        expect(likes.users).to.has.length(10);
        expect(likes.users[0].id).to.be.equal("30");
        expect(likes.users[9].id).to.be.equal("21");

        response = await getTweet(3, 2, 1);
        likes = response.body.data.tweet.likes;
        expect(likes.totalCount).to.be.equal(30);
        expect(likes.users).to.has.length(10);
        expect(likes.users[0].id).to.be.equal("20");
        expect(likes.users[9].id).to.be.equal("11");

        response = await getTweet(3, 3, 1);
        likes = response.body.data.tweet.likes;
        expect(likes.totalCount).to.be.equal(30);
        expect(likes.users).to.has.length(10);
        expect(likes.users[0].id).to.be.equal("10");
        expect(likes.users[9].id).to.be.equal("1");

        response = await getTweet(3, 4, 1);
        likes = response.body.data.tweet.likes;
        expect(likes.totalCount).to.be.equal(30);
        expect(likes.users).to.has.length(0);
    });

    it("get tweet likes count", async () => {
        const response = await getTweet(3, 1, 1);
        expect(response.body.data.tweet.likesCount).to.be.equal(30);
    });

    it("get tweet replies with paging", async () => {
        const tweet = await Tweet.create({
            text: "hello world",
            userId: 2,
            state: "O",
            originalTweetId: 7,
        });
        const tweets = await createTweets();
        await tweet.$add("replies", tweets);

        let response = await getTweet(7, 1, 1);
        let replies = response.body.data.tweet.replies;
        expect(replies.totalCount).to.be.equal(24);
        expect(replies.tweets).to.has.length(10);
        expect(replies.tweets[0].id).to.be.equal("8");
        expect(replies.tweets[9].id).to.be.equal("17");

        response = await getTweet(7, 1, 2);
        replies = response.body.data.tweet.replies;
        expect(replies.totalCount).to.be.equal(24);
        expect(replies.tweets).to.has.length(10);
        expect(replies.tweets[0].id).to.be.equal("18");
        expect(replies.tweets[9].id).to.be.equal("27");

        response = await getTweet(7, 1, 3);
        replies = response.body.data.tweet.replies;
        expect(replies.totalCount).to.be.equal(24);
        expect(replies.tweets).to.has.length(4);
        expect(replies.tweets[0].id).to.be.equal("28");
        expect(replies.tweets[3].id).to.be.equal("31");

        response = await getTweet(7, 1, 4);
        replies = response.body.data.tweet.replies;
        expect(replies.totalCount).to.be.equal(24);
        expect(replies.tweets).to.has.length(0);
    });

    it("get tweet replies count", async () => {
        const response = await getTweet(7, 1, 1);
        expect(response.body.data.tweet.repliesCount).to.be.equal(24);
    });

    it("get thread tweet", async () => {
        const resOriginalTweet = await createTweet("test");
        const resReplyTweet = await createReply(
            "reply1",
            resOriginalTweet.body.data.createTweet.id
        );
        await createReply("reply2", resReplyTweet.body.data.createReply.id);
        const response = await getTweet(34, 1, 1);
        expect(response.body.data.tweet.threadTweet.id).to.be.equal("32");
    });

    it("get replied to tweet", async () => {
        const response = await getTweet(34, 1, 1);
        expect(response.body.data.tweet.repliedToTweet.id).to.be.equal("33");
    });

    it("get is liked", async () => {
        const tweet = await Tweet.findByPk(34);
        const user = await User.findByPk(1);
        await user?.$add("likes", tweet!);
        const response = await getTweet(34, 1, 1);
        expect(response.body.data.tweet.isLiked).to.be.true;
        const response2 = await getTweet(33, 1, 1);
        expect(response2.body.data.tweet.isLiked).to.be.false;
    });

    after(async () => {
        await server.close();
    });
});
