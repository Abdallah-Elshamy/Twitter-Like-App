import request from "supertest";
import app from "../../app";

export const updateUser = async (id: number, userInput: any) => {
    return await request(app)
        .post("/graphql")
        .send({
            query: `
            mutation {
                updateUser(id: ${id}, userInput: {
                    userName: "${userInput.userName}",
                    email: "${userInput.email}",
                    password: "${userInput.password}",
                    name: "${userInput.name}",
                    imageURL: "${userInput.imageURL}",
                    bio: "${userInput.bio}"
                    coverImageURL: "${userInput.coverImageURL}"
                }) {
                    name
                    userName
                    email
                    imageURL
                    coverImageURL
                    bio
                    }
                }
        `,
        });
};

export const emptyUpdateUser = async (id: number) => {
    return await request(app)
        .post("/graphql")
        .send({
            query: `
            mutation {
                updateUser(id: ${id}, userInput: {}) {
                    name
                    userName
                }
        }
        `,
        });
};

export const updateUserName = async (id: number, userInput: any) => {
    return await request(app)
        .post("/graphql")
        .send({
            query: `
            mutation {
                updateUser(id: ${id}, userInput: {name: "${userInput.name}"}) {
                    name
                }
        }
        `,
        });
};

export const updateUserPassword = async (id: number, userInput: any) => {
    return await request(app)
        .post("/graphql")
        .send({
            query: `
            mutation {
                updateUser(id: ${id}, userInput: {password: "${userInput.password}"}) {
                    name
                }
        }
        `,
        });
};

export const updateUserEmail = async (id: number, userInput: any) => {
    return await request(app)
        .post("/graphql")
        .send({
            query: `
            mutation {
                updateUser(id: ${id}, userInput: {email: "${userInput.email}"}) {
                    email
                }
        }
        `,
        });
};

export const updateUserImageURL = async (id: number, userInput: any) => {
    return await request(app)
        .post("/graphql")
        .send({
            query: `
            mutation {
                updateUser(id: ${id}, userInput: {imageURL: "${userInput.imageURL}"}) {
                    imageURL
                }
        }
        `,
        });
};

export const updateUserCoverImageURL = async (id: number, userInput: any) => {
    return await request(app)
        .post("/graphql")
        .send({
            query: `
            mutation {
                updateUser(id: ${id}, userInput: {coverImageURL: "${userInput.coverImageURL}"}) {
                    coverImageURL
                }
        }
        `,
        });
};

export const updateUserUserName = async (id: number, userInput: any) => {
    return await request(app)
        .post("/graphql")
        .send({
            query: `
            mutation {
                updateUser(id: ${id}, userInput: {userName: "${userInput.userName}"}) {
                    coverImageURL
                }
        }
        `,
        });
};

export const unlike = async (tweetId: number) => {
    return await request(app)
        .post("/graphql")
        .send({
            query: `
            mutation {
                unlike(tweetId: ${tweetId})
            }
        `,
        });
};
