import { gql } from "@apollo/client";

export const SEND_MESSAGE = gql`
mutation sendMessage ($message:SendMessageInput!) {
  sendMessage(message: $message ) {
    id
    from {userName id name imageURL}
    to {userName id name imageURL}
    message
    createdAt
    updatedAt
    isSeen
  }
}
`