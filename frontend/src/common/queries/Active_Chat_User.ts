import { gql } from "@apollo/client";

export const Active_Chat_User = gql`
query @client {
  chatUser {
    id
    usename
    name
    imgURL

  }
}
`