import request from "supertest";
import app from "../../app";

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

export const hashtags = async () => {
    return await await request(app).post("/graphql").send({
        query: `
        query {
            hashtags {
                totalCount
                hashtags {
                    word
                    tweets {
                        totalCount
                    }
                }
            }
        }
        `,
    });
};

export const hashtagsWithPagination = async (page: number) => {
    return await await request(app)
        .post("/graphql")
        .send({
            query: `
            query {
                hashtags(page: ${page}) {
                    totalCount
                    hashtags {
                        word
                        tweets {
                            totalCount
                        }
                    }
                }
            }
            `,
        });
};
