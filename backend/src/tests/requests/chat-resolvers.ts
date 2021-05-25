import request from "supertest";
import app from "../../app";

export const sendMessage = async (
    message: string,
    to: number,
    token: string | undefined = undefined
) => {
    return await request(app)
        .post("/graphql")
        .set("Authorization", `Bearer ${token}`)
        .send({
            query: `
            mutation {
                sendMessage(message: {
                    toUserId: ${to}
                    messageBody: "${message}"
                }){
                    id
                    from { id }
                    to { id }
                    message
                    isSeen
                }
            }
        `,
        });
};

export const getChatHistory = async (
    otherUserId: number,
    page: number,
    token: string | undefined = undefined
) => {
    return await request(app)
        .post("/graphql")
        .set("Authorization", `Bearer ${token}`)
        .send({
            query: `
            query {
                getChatHistory(
                    otherUserId: ${otherUserId}
                    page: ${page}
                ){
                    messages {
                        id
                        from {id}
                        to { id }
                        message
                        isSeen
                    }
                    totalCount
                }
            }
        `,
        });
};

export const setMessageSeen = async (
    messageId: number,
    token: string | undefined = undefined
) => {
    return await request(app)
        .post("/graphql")
        .set("Authorization", `Bearer ${token}`)
        .send({
            query: `
            mutation {
                setMessageSeen(
                    messageId: ${messageId}
                )
            }
        `,
        });
};

export const getUnseenMessages = async (
    page: number,
    token: string | undefined = undefined
) => {
    return await request(app)
        .post("/graphql")
        .set("Authorization", `Bearer ${token}`)
        .send({
            query: `
            query {
                getUnseenMessages(
                    page: ${page}
                ){
                    messages {
                        id
                        from {id}
                        to { id }
                        message
                        isSeen
                    }
                    totalCount
                }
            }
        `,
        });
};