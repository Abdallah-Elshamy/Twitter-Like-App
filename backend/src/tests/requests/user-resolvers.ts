import request from "supertest";
import app from "../../app";

export const updateUser = async (
    userInput: any,
    authToken: string | undefined = undefined
) => {
    return await request(app)
        .post("/graphql")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
            query: `
            mutation {
                updateUser(userInput: {
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

export const login = async (userNameOrEmail: string, password: string) => {
    return await request(app)
        .post("/graphql")
        .send({
            query: `
            query {
                login(
                    userNameOrEmail: "${userNameOrEmail}"
                    password: "${password}"
                ){
                    token
                }
            }
        `,
        });
};

export const emptyUpdateUser = async (
    authToken: string | undefined = undefined
) => {
    return await request(app)
        .post("/graphql")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
            query: `
            mutation {
                updateUser(userInput: {}) {
                    name
                    userName
                }
        }
        `,
        });
};

export const updateUserName = async (
    userInput: any,
    authToken: string | undefined = undefined
) => {
    return await request(app)
        .post("/graphql")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
            query: `
            mutation {
                updateUser(userInput: {name: "${userInput.name}"}) {
                    name
                }
        }
        `,
        });
};

export const updateUserPassword = async (
    userInput: any,
    authToken: string | undefined = undefined
) => {
    return await request(app)
        .post("/graphql")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
            query: `
            mutation {
                updateUser(userInput: {password: "${userInput.password}"}) {
                    name
                }
        }
        `,
        });
};

export const updateUserEmail = async (
    userInput: any,
    authToken: string | undefined = undefined
) => {
    return await request(app)
        .post("/graphql")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
            query: `
            mutation {
                updateUser(userInput: {email: "${userInput.email}"}) {
                    email
                }
        }
        `,
        });
};

export const updateUserImageURL = async (
    userInput: any,
    authToken: string | undefined = undefined
) => {
    return await request(app)
        .post("/graphql")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
            query: `
            mutation {
                updateUser(userInput: {imageURL: "${userInput.imageURL}"}) {
                    imageURL
                }
        }
        `,
        });
};

export const updateUserCoverImageURL = async (
    userInput: any,
    authToken: string | undefined = undefined
) => {
    return await request(app)
        .post("/graphql")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
            query: `
            mutation {
                updateUser(userInput: {coverImageURL: "${userInput.coverImageURL}"}) {
                    coverImageURL
                }
        }
        `,
        });
};

export const updateUserUserName = async (
    userInput: any,
    authToken: string | undefined = undefined
) => {
    return await request(app)
        .post("/graphql")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
            query: `
            mutation {
                updateUser(userInput: {userName: "${userInput.userName}"}) {
                    coverImageURL
                }
        }
        `,
        });
};

export const unlike = async (
    tweetId: number,
    authToken: string | undefined = undefined
) => {
    return await request(app)
        .post("/graphql")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
            query: `
            mutation {
                unlike(tweetId: ${tweetId})
            }
        `,
        });
};

export const unfollow = async (
    userId: number,
    authToken: string | undefined = undefined
) => {
    return await request(app)
        .post("/graphql")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
            query: `
            mutation {
                unfollow(userId: ${userId})
            }
        `,
        });
};

export const hashtag = async (word: string) => {
    return await request(app)
        .post("/graphql")
        .send({
            query: `
            query {
                hashtag(word: "${word}") {
                    word
                    tweets {
                        totalCount
                        tweets {
                            id
                            text
                        }
                    }
                }
            }
        `,
        });
};

export const createUser = async (userName: string, name: string) => {
    return await request(app)
        .post("/graphql")
        .send({
            query: `
            mutation {
                createUser(userInput: {
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

export const createUserWithImage = async (userName: string, name: string) => {
    return await request(app)
        .post("/graphql")
        .send({
            query: `
            mutation {
                createUser(userInput: {
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

export const createUserWithBio = async (userName: string, name: string) => {
    return await request(app)
        .post("/graphql")
        .send({
            query: `
            mutation {
                createUser(userInput: {
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
                createUser(userInput: {
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

export const createUserComplete = async (userName: string, name: string) => {
    return await request(app)
        .post("/graphql")
        .send({
            query: `
            mutation {
                createUser(userInput: {
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

export const createUserWithEmailPassword = async (
    email: string,
    password: string
) => {
    return await request(app)
        .post("/graphql")
        .send({
            query: `
            mutation {
                createUser(userInput: {
                    userName: "naruto",
                    name: "The Seventh Hokage",
                    email: "${email}",
                    password: "${password}",
                    bio: "That is MY Ninja Way!",
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

export const createUserWithImages = async (
    imageURL: string,
    coverImageURL: string
) => {
    return await request(app)
        .post("/graphql")
        .send({
            query: `
            mutation {
                createUser(userInput: {
                    userName: "naruto",
                    name: "The Seventh Hokage",
                    email: "naruto@konoha.com",
                    password: "hidden_leaf",
                    bio: "That is MY Ninja Way!",
                    imageURL: "${imageURL}",
                    coverImageURL: "${coverImageURL}"
                    
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

export const follow = async (userId: number) => {
    return await request(app)
        .post("/graphql")
        .send({
            query: `
            mutation {
                follow(userId: ${userId})
            }
        `,
        });
};

export const like = async (tweetId: number) => {
    return await request(app)
        .post("/graphql")
        .send({
            query: `
            mutation {
                like(tweetId: ${tweetId})
            }
        `,
        });
};

export const createTweet = async () => {
    return await request(app).post("/graphql").send({
        query: `
            mutation {
                createTweet(tweet: {
                    text: "One ring to rule them all",
                }){
                    id,
                    text
                }
            }
        `,
    });
};

export const createTwentyUser = async () => {
    for (let i: number = 1; i <= 20; i++) {
        await request(app)
            .post("/graphql")
            .send({
                query: `
            mutation {
                createUser(userInput: {
                    userName: "kage${i}",
                    name: "kage bunshin no jutsu",
                    email: "kage${i}@konoha.com",
                    password: "hidden_leaf",
                    bio: "That is MY Ninja Way!",
                    imageURL: "https://picsum.photos/200/300",
                    coverImageURL: "https://picsum.photos/200/300"
                }){
                    id,
                }
            }
        `,
            });
    }
    return true;
};

export const followFifteenUser = async () => {
    for (let i: number = 2; i <= 16; i++) {
        await request(app)
            .post("/graphql")
            .send({
                query: `
            mutation {
                follow(userId: ${i})
            }
        `,
            });
    }
    return true;
};

export const getUser = async (id: number) => {
    return await request(app)
        .post("/graphql")
        .send({
            query: `
            query {
                user(id: ${id}) {
                    id,
                    userName,
                    email,
                    name,
                    imageURL,
                    bio,
                    coverImageURL,
                    following(page: 1) {
                        totalCount,
                        users {
                            following {
                                totalCount,
                                users {
                                  id
                                }
                            }
                        }
                    }
                    followingCount,
                    followers(page: 1) {
                        totalCount,
                        users {
                            followers {
                                totalCount,
                                users {
                                  id
                                }
                            }
                        }
                    }
                    followersCount,
                    tweets {
                        totalCount,
                        tweets {
                            text
                        }
                    },
                    likes {
                        totalCount,
                        tweets {
                            text
                        }
                    }
                }
            }
        `,
        });
};

export const getUsersWithoutPage = async (search: string) => {
    return await request(app)
        .post("/graphql")
        .send({
            query: `
            query {
                users(search: "${search}") {
                    totalCount,
                    users {
                        id,
                        userName
                    }
                }
            }`,
        });
};

export const getUsersWithPage = async (search: string, page: number) => {
    return await request(app)
        .post("/graphql")
        .send({
            query: `
            query {
                users(search: "${search}", page: ${page}) {
                    totalCount,
                    users {
                        id,
                        userName
                    }
                }
            }`,
        });
};
