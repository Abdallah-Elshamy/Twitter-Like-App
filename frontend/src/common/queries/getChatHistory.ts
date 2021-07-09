import { gql } from "@apollo/client";

export const CHAT_HISTORY = gql`
query getChatHistory ($otherUserId: ID!, $page: Int) {
  getChatHistory(otherUserId: $otherUserId, page: $page ) {
    totalCount
    messages{
      id
      from {userName id}
      to {userName id}
      message
      createdAt
      updatedAt
      isSeen
    }
  }
}
`