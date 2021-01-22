import { expect } from "chai";
import request from "supertest";
import app, { serverPromise } from "../app";
import {User} from "../models";
import db from '../db'

let server: any;

const createTweet = async(text: any, state: any) => {
    return await request(app).post("/graphql").send({
        query: `
            mutation {
                createTweet(tweet: {
                    text: "${text}"
                    state: "${state}"
                }){
                    id
                }
            }
        `,
    });
}

describe("tweet-resolvers", (): void => {
    before(async () => {
        server = await serverPromise;
        await server.close();
        await server.listen();
        await db.sync({force: true})
        const user = await User.create({
            name: "Test",
            userName: "test123",
            email: "test@gmail.com",
            hashedPassword: "123456789",            
        })
    });

    it("createTweet with text and state inputs", async () => {
        const response = await createTweet("hello world", "O")
        expect(response.body).to.has.property("data");
        expect(response.body.data).to.has.property("createTweet");
        expect(response.body.data.createTweet).to.has.property("id")
    });

    after(async() => {
        await server.close();
    });
});
