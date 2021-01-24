import request from "supertest";
import app from "../../app";

export const createUser = async (
    userName: string,
    name: string
) => {
    return await request(app)
        .post("/graphql")
        .send({
            query: `
            mutation {
                createUser(user: {
                    userName: "${userName}",
                    name: "${name}",
                    email: "bilbo_baggins@shire.com",
                    password: "myPrecious"
                }){
                    id,
                    userName,
                    name
                }
            }
        `,
        });
};

export const createUserWithImage = async (
    userName: string,
    name: string
) => {
    return await request(app)
        .post("/graphql")
        .send({
            query: `
            mutation {
                createUser(user: {
                    userName: "${userName}",
                    name: "${name}",
                    email: "bilbo_baggins@shire.com",
                    password: "myPrecious",
                    imageURL: "https://picsum.photos/200/300"
                }){
                    id,
                    userName,
                    name,
                    imageURL
                }
            }
        `,
        });
};

export const createUserWithBio = async (
    userName: string,
    name: string
) => {
    return await request(app)
        .post("/graphql")
        .send({
            query: `
            mutation {
                createUser(user: {
                    userName: "${userName}",
                    name: "${name}",
                    email: "bilbo_baggins@shire.com",
                    password: "myPrecious",
                    bio: "RUN YOU FOOLS!"
                }){
                    id,
                    userName,
                    name,
                    image,
                    bio
                }
            }
        `,
        });
};

export const createUserWithCoverImage = async (
    userName: string,
    name: string
) => {
    return await request(app)
        .post("/graphql")
        .send({
            query: `
            mutation {
                createUser(user: {
                    userName: "${userName}",
                    name: "${name}",
                    email: "bilbo_baggins@shire.com",
                    password: "myPrecious",
                    coverImageURL: "https://picsum.photos/200/300"
                }){
                    id,
                    userName,
                    name,
                    coverImageURL
                }
            }
        `,
        });
};

export const createUserComplete = async (
    userName: string,
    name: string
) => {
    return await request(app)
        .post("/graphql")
        .send({
            query: `
            mutation {
                createUser(user: {
                    userName: "${userName}",
                    name: "${name}",
                    email: "bilbo_baggins@shire.com",
                    password: "myPrecious",
                    bio: "RUN YOU FOOLS!",
                    imageURL: "https://picsum.photos/200/300",
                    coverImageURL: "https://picsum.photos/200/300"
                    
                }){
                    id,
                    userName,
                    name,
                    image,
                    bio,
                    imageURL,
                    coverImageURL
                }
            }
        `,
        });
};