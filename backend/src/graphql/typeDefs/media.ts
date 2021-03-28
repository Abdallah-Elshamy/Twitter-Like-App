import { gql } from "apollo-server-express";

export default gql`
    extend type Query {
        getUploadURL: String!
    }
    extend type Mutation {
        deleteMedia(id: String!): Boolean!
    }
`;
