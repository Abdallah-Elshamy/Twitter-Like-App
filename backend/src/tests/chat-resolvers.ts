import { expect } from "chai";
import { serverPromise } from "../app";
import db from "../db";
import { ChatMessage } from "../models";
import { sendMessage } from "./requests/chat-resolvers";
import { createTwentyUser, login } from "./requests/user-resolvers";

let server: any;

describe("chat-resolvers", (): void => {
    let token: string;
    before(async () => {
        server = await serverPromise;
        server.close();
        server.listen();
    });

    describe("sendMessage resolver", () => {
        before(async () => {
            await db.sync({ force: true });
            await createTwentyUser();
            const response = await login("kage1", "hidden_leaf");
            token = response.body.data.login.token;
            // add message to DB
            const messagesPromises = [];
            for (let i = 2; i < 6; i++) {
                for (let k = 0; k < 10; k++) {
                    messagesPromises.push(
                        ChatMessage.create({ from: 1, to: i, message: "hi" })
                    );
                    messagesPromises.push(
                        ChatMessage.create({ from: i, to: 1, message: "hi" })
                    );
                }
            }
            await Promise.all(messagesPromises);
        });
        it("succeeds in storing a message", async () => {
            const response = await sendMessage("hello", 2, token);

            expect(response.body.data.sendMessage).to.include({
                id: "81",
                message: "hello",
                isSeen: false,
            });
            expect(response.body.data.sendMessage.from.id).to.equal("1");
            expect(response.body.data.sendMessage.to.id).to.equal("2");
        });

        it("fails to send message with zero length", async () => {
            const response = await sendMessage("", 2, token);

            expect(response.body.errors).has.length(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 400,
                message: "The message is empty!",
            });
        });

        it("fails to send a message to a non existent user", async () => {
            const response = await sendMessage("hello", 50, token);

            expect(response.body.errors).has.length(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 404,
                message: "No user was found with this id!",
            });
        });
        it("fails to send a message without a token", async () => {
            const response = await sendMessage("hello", 2);
            expect(response.body.errors).to.has.length(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 401,
            });
        });
    });

    after(() => {
        server.close();
    });
});
