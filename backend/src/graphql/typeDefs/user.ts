import { gql } from "apollo-server-express";

export default gql`
    extend type Query {
        user(id: ID!): User!
        users(search: String!, page: Int): PaginatedUsers!
        login(userNameOrEmail: String!, password: String!): Token!
    }

    extend type Mutation {
        createUser(userInput: UserCreateInput!): User!
        updateUser(userInput: UserUpdateInput!): User!
        like(tweetId: ID!): Boolean
        unlike(tweetId: ID!): Boolean
        follow(userId: ID!): Boolean
        unfollow(userId: ID!): Boolean
        banUser(userId: ID!): Boolean!
    }

    type Token {
        token: String!
    }

    type User {
        id: ID!
        userName: String!
        email: String!
        name: String!
        birthDate: String!
        imageURL: String
        bio: String
        coverImageURL: String
        isBanned: Boolean!
        isFollowing: Boolean
        following(page: Int): PaginatedUsers!
        followingCount: Int!
        isFollower: Boolean
        followers(page: Int): PaginatedUsers!
        followersCount: Int!
        tweets(page: Int): PaginatedTweets!
        likes(page: Int): PaginatedTweets!
        groups: [String]!
        permissions: [String]!
        createdAt: String!
        updatedAt: String!
    }

    type PaginatedUsers {
        totalCount: Int!
        users: [User]!
    }

    input UserCreateInput {
        userName: String!
        email: String!
        password: String!
        name: String!
        birthDate: String!
        imageURL: String
        bio: String
        coverImageURL: String
    }

    input UserUpdateInput {
        userName: String
        email: String
        password: String
        name: String
        birthDate: String
        imageURL: String
        bio: String
        coverImageURL: String
    }
`;
