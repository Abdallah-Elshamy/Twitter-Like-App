import { expect } from "chai";
import { serverPromise } from "../app";
import db from "../db";
import { ChatMessage } from "../models";
import {
    sendMessage,
    getChatHistory,
    setMessageSeen,
    getUnseenMessages,
} from "./requests/chat-resolvers";
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

    describe("getChatHistory resolver", () => {
        it("succeeds in getting sorted History", async () => {
            const response = await getChatHistory(2, 1, token);
            expect(response.body.data.getChatHistory.totalCount).to.equal(21);
            expect(response.body.data.getChatHistory.messages).to.have.length(
                20
            );
            expect(response.body.data.getChatHistory.messages[0]).to.include({
                id: "81",
                message: "hello",
                isSeen: false,
            });
            expect(
                response.body.data.getChatHistory.messages[0].from.id
            ).to.equal("1");
            expect(
                response.body.data.getChatHistory.messages[0].to.id
            ).to.equal("2");
        });

        it("succeeds in paginating History", async () => {
            const response = await getChatHistory(2, 2, token);
            expect(response.body.data.getChatHistory.totalCount).to.equal(21);
            expect(response.body.data.getChatHistory.messages).to.have.length(
                1
            );
            expect(response.body.data.getChatHistory.messages[0]).to.include({
                message: "hi",
                isSeen: false,
            });
        });

        it("fails to get chat history with a non existent user", async () => {
            const response = await getChatHistory(50, 1, token);

            expect(response.body.errors).has.length(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 404,
                message: "No user was found with this id!",
            });
        });

        it("fails to get chat history without a token", async () => {
            const response = await getChatHistory(2, 0);
            expect(response.body.errors).to.has.length(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 401,
            });
        });
    });

    describe("setMessageSeen resolver", () => {
        before(async () => {
            ChatMessage.create({ from: 2, to: 1, message: "hi" });
        });

        it("succeeds in setting isSeen for a message", async () => {
            const response = await setMessageSeen(82, token);
            expect(response.body.data.setMessageSeen).to.equal(true);
            expect((await ChatMessage.findByPk(82))!.isSeen).to.equal(true);
        });

        it("fails to set isSeen for a non existent message", async () => {
            const response = await setMessageSeen(100, token);

            expect(response.body.errors).has.length(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 404,
                message: "No message was found with this id!",
            });
        });

        it("fails to set isSeen for a message without a token", async () => {
            const response = await setMessageSeen(81);
            expect(response.body.errors).to.has.length(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 401,
            });
        });

        it("fails to set isSeen for a message sent to another user", async () => {
            const response = await setMessageSeen(1, token);

            expect(response.body.errors).has.length(1);
            expect(response.body.errors[0]).to.include({
                statusCode: 400,
                message: "This message was sent to another user!",
            });
        });
    });

    describe("getUnseenMessages resolver", () => {
        it("succeeds in getting unseen messages", async () => {
            const response = await getUnseenMessages(1, token);
            expect(response.body.data.getUnseenMessages.totalCount).to.equal(
                40
            );
            expect(
                response.body.data.getUnseenMessages.messages
            ).to.have.length(20);
            expect(response.body.data.getUnseenMessages.messages[5]).to.include(
                {
                    message: "hi",
                    isSeen: false,
                }
            );
            expect(
                response.body.data.getUnseenMessages.messages[7].to.id
            ).to.equal("1");
        });

        it("succeeds in paginating unseen messages", async () => {
            const response = await getUnseenMessages(2, token);
            expect(response.body.data.getUnseenMessages.totalCount).to.equal(
                40
            );
            expect(
                response.body.data.getUnseenMessages.messages
            ).to.have.length(20);
            expect(response.body.data.getUnseenMessages.messages[5]).to.include(
                {
                    message: "hi",
                    isSeen: false,
                }
            );
            expect(
                response.body.data.getUnseenMessages.messages[7].to.id
            ).to.equal("1");
        });

        it("succeeds in paginating unseen messages", async () => {
            const response = await getUnseenMessages(3, token);
            expect(response.body.data.getUnseenMessages.totalCount).to.equal(
                40
            );
            expect(
                response.body.data.getUnseenMessages.messages
            ).to.have.length(0);
        });

        it("fails to get unseen messages without a token", async () => {
            const response = await getUnseenMessages(1);
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
