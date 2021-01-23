import { expect } from "chai";
import request from "supertest";
import app, { serverPromise } from "../app";
import { User, Tweet } from "../models";
import db from "../db";

let server: any;

const createTweet = async (text: any) => {
    return await request(app)
        .post("/graphql")
        .send({
            query: `
            mutation {
                createTweet(tweet: {
                    text: "${text}"
                }){
                    id
                    text
                    state
                    mediaURLs
                }
            }
        `,
        });
};

const createTweetWithMedia = async (text: any) => {
    return await request(app)
        .post("/graphql")
        .send({
            query: `
            mutation {
                createTweet(tweet: {
                    text: "${text}"
                    mediaURLs: ["a","b","c","d"]
                }){
                    id
                    text
                    state
                    mediaURLs
                }
            }
        `,
        });
};

const failcreateTweetValidation = async (
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

const createReply = async (text: any, repliedToTweet: any) => {
    return await request(app)
        .post("/graphql")
        .send({
            query: `
            mutation {
                createReply(
                    tweet: {
                        text: "${text}"
                    }
                    repliedToTweet: ${repliedToTweet}
                ){
                    id
                    text
                    state
                    mediaURLs
                }
            }
        `,
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

const deleteTweet = async (id: number) => {
    return await request(app)
        .post("/graphql")
        .send({
            query: `
                mutation {
                    deleteTweet(id: ${id})
                }
            `,
        });
};

const getTweet = async (id: number) => {
    return await request(app)
        .post("/graphql")
        .send({
            query: `
                query {
                    tweet(id: ${id}){
                        id
                        text
                        state
                        mediaURLs
                        user{
                            id,
                            name,
                            userName,
                            email
                        }
                        originalTweet{
                            id
                        }
                    }
                }
            `,
        });
};

describe("tweet-resolvers", (): void => {
    before(async () => {
        server = await serverPromise;
        await server.close();
        await server.listen();
        await db.sync({ force: true });
        const user = await User.create({
            name: "Test",
            userName: "test123",
            email: "test@gmail.com",
            hashedPassword: "123456789",
        });
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
        await failcreateTweetValidation(
            "",
            "text length must be between 1 to 280 chars!",
            "text"
        );
    });

    it("fail createTweet with text more than 280 char", async () => {
        await failcreateTweetValidation(
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

    it("get tweet query all non relational fields + user + originalTweet", async () => {
        const response = await getTweet(3);
        console.log(response);
        expect(response.body.data.tweet).to.include({
            id: "3",
            text: "hello world",
            state: "C",
        });
        expect(response.body.data.tweet.mediaURLs).to.has.length(0);
        expect(response.body.data.tweet.user).to.include({
            id: "1",
            name: "Test",
            userName: "test123",
            email: "test@gmail.com",
        });
        expect(response.body.data.tweet.originalTweet).to.include({
            id: "3",
        });
    });

    after(async () => {
        await server.close();
    });
});
