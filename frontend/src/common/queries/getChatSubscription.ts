import { gql } from "@apollo/client";

export const SEND_MESSAGE_sub = gql`
subscription messageSent
{ messageSent {
      id
      from {userName id},
      to {userName id},
      message
      createdAt
      updatedAt
      isSeen
    }
  }
`
export default SEND_MESSAGE_sub;