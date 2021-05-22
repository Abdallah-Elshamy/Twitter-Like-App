import { gql } from "apollo-server-express";

export default gql`
    extend type Query {
        tweet(id: ID!, isSFW: Boolean): Tweet!
        tweets(
            userId: ID!
            page: Int
            filter: String
            isSFW: Boolean
        ): PaginatedTweets!
        getFeed(page: Int, isSFW: Boolean): PaginatedTweets
        reportedTweets(page: Int): PaginatedTweets!
        NSFWTweets(page: Int): PaginatedTweets!
    }
    extend type Mutation {
        createTweet(tweet: TweetCreateInput!): Tweet!
        createReply(tweet: TweetCreateInput!, repliedToTweet: ID!): Tweet!
        createRetweet(originalTweetId: ID!): Tweet!
        createQuotedRetweet(
            originalTweetId: ID!
            tweet: TweetCreateInput!
        ): Tweet!
        deleteTweet(id: ID!): Boolean!
        reportTweet(id: ID!, reason: String): Boolean!
        ignoreReportedTweet(id: ID!): Boolean!
    }

    extend type Subscription {
        liveFeed: NewFeedUpdates!
    }

    type Tweet {
        id: ID!
        user: User!
        text: String!
        mediaURLs: [String]!
        state: String!
        originalTweet: Tweet!
        isSFW: Boolean!
        likes(page: Int): PaginatedUsers!
        likesCount: Int!
        replies(page: Int): PaginatedTweets!
        repliesCount: Int!
        threadTweet: Tweet
        hashtags(page: Int): PaginatedHashtags!
        repliedToTweet: Tweet
        isLiked: Boolean
        reportedBy(page: Int): PaginatedUsers!
        retweetsCount: Int!
        quotedRetweetsCount: Int!
        createdAt: String!
        updatedAt: String!
        mode: String
    }

    type PaginatedTweets {
        totalCount: Int!
        tweets: [Tweet]!
    }

    input TweetCreateInput {
        text: String!
        mediaURLs: [String]
    }

    type NewFeedUpdates {
        tweet: Tweet!
        followers: [ID]!
    }
`;
