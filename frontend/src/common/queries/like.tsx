import { gql } from "@apollo/client";

export const LIKE = gql`
mutation like ($id:ID!) {
  like(tweetId: $id ) {
    scalar
  }
}
`
export const UNLIKE = gql`
mutation unlike ($id:ID!) {
  unlike(tweetId: $id ) {
    scalar
  }
}
`