import request from "supertest";
import app from "../../app";

export const createTweet = async (text: any) => {
    return await request(app)
        .post("/graphql")
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

export const createTweetWithMedia = async (text: any) => {
    return await request(app)
        .post("/graphql")
        .send({
            query: `
            mutation {
                createTweet(tweet: {
                    text: "${text}"
                    mediaURLs: ["a","b","c","d"]
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

export const createReply = async (text: any, repliedToTweet: any) => {
    return await request(app)
        .post("/graphql")
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

export const deleteTweet = async (id: number) => {
    return await request(app)
        .post("/graphql")
        .send({
            query: `
                mutation {
                    deleteTweet(id: ${id})
                }
            `,
        });
};

export const getTweet = async (id: number, likesPage: number = 1, repliesPage: number = 1, hashtagePage: number = 1) => {
    return await request(app)
        .post("/graphql")
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
                    }
                }
            `,
        });
};