import { expect } from "chai";
import { Console } from "console";

import { serverPromise } from "../app";
import db from "../db";
import { Hashtag, User, Tweet } from "../models";
import {
    hashtag,
    hashtags,
    hashtagsWithPagination,
} from "./requests/hashtag-resolvers";

let server: any;

describe("hashtag-resolvers", (): void => {
    before(async () => {
        server = await serverPromise;
        server.close();
        server.listen();
    });

    describe("hashtag resolver", () => {
        it("succeeds in finding hashtag data", async () => {
            await db.sync({ force: true });
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

    describe("hashtags resolver", () => {
        before(async () => {
            await db.sync({ force: true });
            const user = await User.create({
                name: "Bilbo Bagins",
                userName: "Bilbothecrazy",
                email: "bilboisacoolhobbit@yahoo.com",
                hashedPassword: "sadsadsa",
                birthDate: "1992-06-12",
            });
            const hashtags: Hashtag[] = [];
            for (let i = 0; i < 11; i++) {
                let hashtag = await Hashtag.create({ word: `HASHTAG #${i+1}` });
                hashtags.push(hashtag);
            }
            const tweets: Tweet[] = [];
            for (let i = 0; i < 11; i++) {
                let tweet = await Tweet.create({
                    userId: user.id,
                    text: `test tweet ${i}`,
                    mediaURLs: [],
                    state: "O",
                });
                tweets.push(tweet);
            }
            for (let i = 1; i <= hashtags.length; i++) {
                for (let j = 0; j < i; j++) {
                    await hashtags[i - 1].$add("tweets", tweets[j]);
                }
            }
        });

        it("gets the trending hashtags", async () => {
            const response = await hashtags();
            expect(response.body.data.hashtags).to.include({
                totalCount: 11,
            });
            expect(response.body.data.hashtags.hashtags[0]).to.include({
                word: "HASHTAG #11",
            });
            expect(response.body.data.hashtags.hashtags[0].tweets).to.include({
                totalCount: 11,
            });
            expect(response.body.data.hashtags.hashtags[9]).to.include({
                word: "HASHTAG #2",
            });
            expect(response.body.data.hashtags.hashtags[9].tweets).to.include({
                totalCount: 2,
            });
        });

        it("gets the trending hashtags paginated", async () => {
            const response = await hashtagsWithPagination(2);

            expect(response.body.data.hashtags).to.include({
                totalCount: 11,
            });
            expect(response.body.data.hashtags.hashtags[0]).to.include({
                word: "HASHTAG #1",
            });
            expect(response.body.data.hashtags.hashtags[0].tweets).to.include({
                totalCount: 1,
            });
        });
    });

    after(() => {
        server.close();
    });
});
