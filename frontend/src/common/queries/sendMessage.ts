import { gql } from "@apollo/client";

export const SEND_MESSAGE = gql`
mutation sendMessage ($message:SendMessageInput!) {
  sendMessage(message: $message ) {
    message
    createdAt
    updatedAt
    isSeen
  }
}
`