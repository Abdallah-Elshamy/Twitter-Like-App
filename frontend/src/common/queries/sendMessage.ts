import { gql } from "@apollo/client";

export const SEND_MESSAGE = gql`
mutation sendMessage ($message:SendMessageInput!) {
  sendMessage(message: $message ) {
    id
    from {userName id}
    to {userName id}
    message
    createdAt
    updatedAt
    isSeen
  }
}
`