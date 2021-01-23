import { gql } from "apollo-server-express";

export default gql`
    extend type Query {
        tweet(id: ID!): Tweet!
    }
    extend type Mutation {
        createTweet(tweet: TweetCreateInput!): Tweet!
        createReply(tweet: TweetCreateInput!, repliedToTweet: ID!): Tweet!
        deleteTweet(id: ID!): String!
    }
    type Tweet {
        id: ID!
        user: User!
        text: String!
        mediaURLs: [String]!
        state: String!
        originalTweet: Tweet!
        likes(page: Int): PaginatedUsers!
        likesCount: Int!
        replies(page: Int): PaginatedTweets!
        repliesCount: Int!
        threadTweet: Tweet
        hashtags(page: Int): PaginatedHashtags!
        repliedToTweet: Tweet
        isLiked: Boolean!
        createdAt: String!
        updatedAt: String!
    }

    type PaginatedTweets {
        totalCount: Int!
        tweets: [Tweet]!
    }

    input TweetCreateInput {
        text: String!
        mediaURLs: [String]
    }
`;
