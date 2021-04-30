import { expect } from "chai";

import { serverPromise } from "../app";
import db from "../db";
import { Hashtag, User, Tweet } from "../models";
import {
    hashtag,
    hashtags,
    hashtagsWithPagination,
} from "./requests/hashtag-resolvers";
import { createUser } from "./requests/user-resolvers";

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
            await createUser("Bilbo11", "Bilbo The Cool");

            const hashtags: Hashtag[] = [];
            for (let i = 0; i < 12; i++) {
                let hashtag = await Hashtag.create({
                    word: `HASHTAG #${i + 1}`,
                });
                hashtags.push(hashtag);
            }

            const tweets: Tweet[] = [];
            for (let i = 0; i < 12; i++) {
                let tweet = await Tweet.create({
                    userId: 1,
                    text: `test tweet ${i}`,
                    mediaURLs: [],
                    state: "O",
                });
                tweets.push(tweet);
            }

            for (let i = 0; i < 12; i++) {
                for (let j = 0; j <= i; j++) {
                    await tweets[i].$add("hashtags", hashtags[j]);
                }
            }
        });

        it("gets the trending hashtags", async () => {
            const response = await hashtags();
            expect(response.body.data.hashtags).to.include({
                totalCount: 12,
            });
            expect(response.body.data.hashtags.hashtags[0]).to.include({
                word: "HASHTAG #1",
            });
            expect(response.body.data.hashtags.hashtags[0].tweets).to.include({
                totalCount: 12,
            });
            expect(response.body.data.hashtags.hashtags[9]).to.include({
                word: "HASHTAG #10",
            });
            expect(response.body.data.hashtags.hashtags[9].tweets).to.include({
                totalCount: 3,
            });
        });

        it("gets the trending hashtags paginated", async () => {
            const response = await hashtagsWithPagination(2);

            expect(response.body.data.hashtags).to.include({
                totalCount: 12,
            });
            expect(response.body.data.hashtags.hashtags[0]).to.include({
                word: "HASHTAG #11",
            });
            expect(response.body.data.hashtags.hashtags[0].tweets).to.include({
                totalCount: 2,
            });
            expect(response.body.data.hashtags.hashtags[1]).to.include({
                word: "HASHTAG #12",
            });
            expect(response.body.data.hashtags.hashtags[1].tweets).to.include({
                totalCount: 1,
            });
        });
    });

    after(() => {
        server.close();
    });
});
