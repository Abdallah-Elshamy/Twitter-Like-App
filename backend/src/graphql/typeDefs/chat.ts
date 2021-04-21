import { gql } from "apollo-server-express";

export default gql`
    extend type Subscription {
        messageSent: ChatMessage
    }

    type ChatMessage {
        from: User!
        to: User!
        message: String!
    }

    input SendMessageInput {
        toUserId: ID!
        messageBody: String!
    }

    extend type Mutation {
        sendMessage(message: SendMessageInput!): ChatMessage!
    }
`;
