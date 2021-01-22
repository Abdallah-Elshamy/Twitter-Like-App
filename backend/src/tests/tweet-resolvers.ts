import { expect } from "chai";
import request from "supertest";
import app, { serverPromise } from "../app";
import { User } from "../models";
import db from "../db";

let server: any;

const createTweet = async (text: any, state: any) => {
    return await request(app)
        .post("/graphql")
        .send({
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

    it("createTweet with text and state inputs", async () => {
        const response = await createTweet("hello world", "O");
        expect(response.body).to.has.property("data");
        expect(response.body.data).to.has.property("createTweet");
        expect(response.body.data.createTweet).to.has.property("id");
    });

    it("fail createTweet with state other than O or R or C or Q", async () => {
        const response = await createTweet("hello", "z");
        expect(response.body).to.has.property("errors");
        expect(response.body.errors).to.has.length(1);
        expect(response.body.errors[0].validators).to.has.length(1);
        expect(response.body.errors[0].validators[0].message).to.be.equal(
            "state must have the value of O or C or R or Q only!"
        );
    });

    it("fail createTweet with text less than 1 char", async () => {
        const response = await createTweet("", "C");
        expect(response.body).to.has.property("errors");
        expect(response.body.errors).to.has.length(1);
        expect(response.body.errors[0].validators).to.has.length(1);
        expect(response.body.errors[0].validators[0].message).to.be.equal(
            "text length must be between 1 to 280 chars!"
        );
    });

    it("fail createTweet with text more than 280 char", async () => {
        const response = await createTweet(
            "0123456789101112131415161718192021222324252627282930313233343536373839404142434445464748495051525354555657585960616263646566676869707172737475767778798081828384858687888990919293949596979899100101102103104105106107108109110111112113114115116117118119120121122123124125126127128129130131132133134135136137138139140141142143144145146147148149150151152153154155156157158159160161162163164165166167168169170171172173174175176177178179180181182183184185186187188189190191192193194195196197198199200201202203204205206207208209210211212213214215216217218219220221222223224225226227228229230231232233234235236237238239240241242243244245246247248249250251252253254255256257258259260261262263264265266267268269270271272273274275276277278279280",
            "C"
        );
        expect(response.body).to.has.property("errors");
        expect(response.body.errors).to.has.length(1);
        expect(response.body.errors[0].validators).to.has.length(1);
        expect(response.body.errors[0].validators[0].message).to.be.equal(
            "text length must be between 1 to 280 chars!"
        );
    });

    after(async () => {
        await server.close();
    });
});
