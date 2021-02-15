import { gql } from "@apollo/client";

export const FOLLOW = gql`
mutation follow ($id:ID!) {
  follow(userId: $id ) 
}
`
export const UNFOLLOW = gql`
mutation follow ($id:ID!) {
  unfollow(userId: $id ) 
}
`