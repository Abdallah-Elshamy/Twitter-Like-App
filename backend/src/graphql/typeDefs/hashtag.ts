import { gql } from "apollo-server-express";

export default gql`
    extend type Query {
        hashtag(word: String!): Hashtag
    }

    type Hashtag {
        word: String!
        tweets(page: Int): PaginatedTweets
        createdAt: String
        updatedAt: String
    }

    type PaginatedHashtags {
        totalCount: Int!
        hashtags: [Hashtag]!
    }
`;
