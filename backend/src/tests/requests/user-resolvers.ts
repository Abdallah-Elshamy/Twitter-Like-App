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
                    email: "frodo_baggins@shire.com",
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
                    email: "gandalf@shire.com",
                    password: "myPrecious",
                    bio: "RUN YOU FOOLS!"
                }){
                    id,
                    userName,
                    name,
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
                    email: "roronoa_zoro@grandline.com",
                    password: "strawhat",
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
                    email: "monkey_d_luffy@grandline.com",
                    password: "strawhat",
                    bio: "But a hero is a guy who gives out the meat to everyone else. I want to eat the damn meat!",
                    imageURL: "https://picsum.photos/200/300",
                    coverImageURL: "https://picsum.photos/200/300"
                    
                }){
                    id,
                    userName,
                    name,
                    bio,
                    imageURL,
                    coverImageURL
                }
            }
        `,
        });
};