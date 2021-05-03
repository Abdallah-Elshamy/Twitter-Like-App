import request from "supertest";
import app from "../../app";

export const sendMessage = async (message: string, to: number, token: string | undefined = undefined) => {
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
