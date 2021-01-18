import { gql } from 'apollo-server-express';

export default gql `
    extend type Query {
        hello: Post!
    }
    input PostInput {
        title: String!
        description: String!
    }
    type Post {
        title: String!
        description: String!
    }
`;