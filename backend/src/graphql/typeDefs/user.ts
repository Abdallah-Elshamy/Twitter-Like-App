import { gql } from "apollo-server-express";

export default gql`
    extend type Query {
        bye: String!
    }

    type User {
    id: ID!
    userName: String!
    email: String!
    name: String!
    imageURL: String
    bio: String
    coverImageURL: String
    following(page: Int): PaginatedUsers!
    followingCount: Int!
    followers(page: Int): PaginatedUsers!
    followersCount: Int!,
    tweets(page: Int): PaginatedTweets!
    likes(page: Int): PaginatedTweets!
    groups: [String]!
    permissions: [String]!
    createdAt: String!
    updatedAt: String!
    }

    type PaginatedUsers {
    total_count: Int!
    users: [User]!
    }

    input UserCreateInput {
    userName: String!
    email: String!
    password: String!
    name: String!
    imageURL: String
    bio: String
    coverImageURL: String
    }

    input UserUpdateInput {
    userName: String
    email: String
    password: String
    name: String
    imageURL: String
    bio: String
    coverImageURL: String
    }
`;
