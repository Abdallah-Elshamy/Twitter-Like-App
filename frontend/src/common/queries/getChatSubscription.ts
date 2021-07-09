import { gql } from "@apollo/client";

const GetChatSub = gql`
subscription messageSent
{ messageSent {
      id
      from {userName id name imageURL},
      to {userName id name imageURL},
      message
      createdAt
      updatedAt
      isSeen
    }
  }
`
export default GetChatSub;