import { gql } from "apollo-server-express";

export default gql`
    extend type Query {
        tweet(id: ID!, isSFW: Boolean): Tweet!
        tweets(userId: ID!, page: Int, filter:String, isSFW: Boolean) : PaginatedTweets!
        getFeed(page: Int): [Tweet]!
    }
    extend type Mutation {
        createTweet(tweet: TweetCreateInput!): Tweet!
        createReply(tweet: TweetCreateInput!, repliedToTweet: ID!): Tweet!
        createRetweet(originalTweetId: ID!): Tweet!
        createQuotedRetweet(originalTweetId: ID!, tweet: TweetCreateInput!): Tweet!
        deleteTweet(id: ID!): Boolean!
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
        isLiked: Boolean
        retweetsCount: Int!
        quotedRetweetsCount: Int!
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
