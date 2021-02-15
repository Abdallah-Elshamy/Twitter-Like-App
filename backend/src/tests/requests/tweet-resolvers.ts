import request from "supertest";
import app from "../../app";

export const createTweet = async (text: any, token: string | undefined = undefined) => {
    return await request(app)
        .post("/graphql")
        .set("Authorization", `Bearer ${token}`)
        .send({
            query: `
            mutation {
                createTweet(tweet: {
                    text: "${text}"
                }){
                    id
                    text
                    state
                    mediaURLs
                }
            }
        `,
        });
};

export const createRetweet = async (
    originalTweetId: number,
    authToken: string | undefined = undefined
) => {
    return await request(app)
        .post("/graphql")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
            query: `
            mutation {
                createRetweet(originalTweetId: "${originalTweetId}"){
                    id
                    text
                    mediaURLs
                    state
                    originalTweet{
                        id
                    }

                }
            }
        `,
        });
};

export const createQuotedRetweetWithMedia = async (
    originalTweetId: number,
    text: string,
    authToken: string | undefined = undefined
) => {
    return await request(app)
        .post("/graphql")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
            query: `
            mutation {
                createQuotedRetweet(
                    originalTweetId: "${originalTweetId}"
                    tweet: {
                        text: "${text}"
                        mediaURLs: [
                            "https://www.vapulus.com/en/wp-content/uploads/2019/05/startup-books.jpg",
                            "https://media.btech.com/media/catalog/product/cache/22b1bed05f04d71c4a848d770186c3c4/h/p/hp-notebook-15-da1885ne_ca36.jpg",
                            "https://media.btech.com/media/catalog/product/cache/22b1bed05f04d71c4a848d770186c3c4/h/p/hp_da2001ne_1.png",
                            "https://www.rayashop.com/media/product/fc3/hp-omen-15-en0013dx-laptop-amd-ryzen-7-4800h-15-6-inch-fhd-512gb-8gb-ram-nvidia-1660-ti-6gb-win-10-22d.jpg"
                        ]
                    }
                ){
                    id
                    text
                    mediaURLs
                    state
                    originalTweet{
                        id
                    }

                }
            }
        `,
        });
};

export const createQuotedRetweet = async (
    originalTweetId: number,
    text: string,
    authToken: string | undefined = undefined
) => {
    return await request(app)
        .post("/graphql")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
            query: `
            mutation {
                createQuotedRetweet(
                    originalTweetId: "${originalTweetId}"
                    tweet: {
                        text: "${text}"
                    }
                ){
                    id
                    text
                    mediaURLs
                    state
                    originalTweet{
                        id
                    }

                }
            }
        `,
        });
};

export const createTweetWithMedia = async (text: any, token: string | undefined = undefined) => {
    return await request(app)
        .post("/graphql")
        .set("Authorization", `Bearer ${token}`)
        .send({
            query: `
            mutation {
                createTweet(tweet: {
                    text: "${text}"
                    mediaURLs: [
                        "https://www.vapulus.com/en/wp-content/uploads/2019/05/startup-books.jpg",
                        "https://media.btech.com/media/catalog/product/cache/22b1bed05f04d71c4a848d770186c3c4/h/p/hp-notebook-15-da1885ne_ca36.jpg",
                        "https://media.btech.com/media/catalog/product/cache/22b1bed05f04d71c4a848d770186c3c4/h/p/hp_da2001ne_1.png",
                        "https://www.rayashop.com/media/product/fc3/hp-omen-15-en0013dx-laptop-amd-ryzen-7-4800h-15-6-inch-fhd-512gb-8gb-ram-nvidia-1660-ti-6gb-win-10-22d.jpg"]
                }){
                    id
                    text
                    state
                    mediaURLs
                }
            }
        `,
        });
};

export const createReply = async (text: any, repliedToTweet: any, token: string | undefined = undefined) => {
    return await request(app)
        .post("/graphql")
        .set("Authorization", `Bearer ${token}`)
        .send({
            query: `
            mutation {
                createReply(
                    tweet: {
                        text: "${text}"
                    }
                    repliedToTweet: ${repliedToTweet}
                ){
                    id
                    text
                    state
                    mediaURLs
                }
            }
        `,
        });
};

export const deleteTweet = async (id: number, token: string | undefined = undefined) => {
    return await request(app)
        .post("/graphql")
        .set("Authorization", `Bearer ${token}`)
        .send({
            query: `
                mutation {
                    deleteTweet(id: ${id})
                }
            `,
        });
};

export const getTweet = async (
    id: number,
    likesPage: number = 1,
    repliesPage: number = 1,
    hashtagePage: number = 1,
    token: string | undefined = undefined
) => {
    return await request(app)
        .post("/graphql")
        .set("Authorization", `Bearer ${token}`)
        .send({
            query: `
                query {
                    tweet(id: ${id}){
                        id
                        text
                        state
                        mediaURLs
                        user{
                            id,
                            name,
                            userName,
                            email
                        }
                        originalTweet{
                            id
                        }
                        likes(page: ${likesPage}) {
                            users{
                                id
                            }
                            totalCount
                        }
                        likesCount
                        replies(page: ${repliesPage}) {
                            tweets{
                                id
                            }
                            totalCount
                        }
                        repliesCount
                        threadTweet{
                            id
                        }
                        repliedToTweet{
                            id
                        }
                        isLiked
                        hashtags(page: ${hashtagePage}){
                            hashtags{
                                word
                            }
                            totalCount
                        }
                        retweetsCount
                        quotedRetweetsCount
                    }
                }
            `,
        });
};

export const getTweets = async (
    userId: number,
    page: number = 1,
    filter: string | null = ""
) => {
    return await request(app)
        .post("/graphql")
        .send({
            query: `
            query {
                tweets(
                    userId: ${userId}
                    page: ${page}
                    filter: "${filter}"
                ){
                    tweets{
                        id
                        state
                    }
                    totalCount
                }
            }    
         `,
        });
};

export const getFeed = async (authToken: string | undefined = undefined) => {
    return await request(app)
        .post("/graphql")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
            query: `
            query {
                getFeed {
                    text
                    user {
                        id
                    }
                }
            }
        `,
        });
};

export const getFeedWithPagination = async (
    page: number,
    authToken: string | undefined = undefined
) => {
    return await request(app)
        .post("/graphql")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
            query: `
            query {
                getFeed(page: ${page}) {
                    text
                    user {
                        id
                    }
                }
            }
        `,
        });
};