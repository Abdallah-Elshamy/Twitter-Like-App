import { gql } from "@apollo/client";

export const isFollowing = gql`
query isFollowing($id:ID!){
  user(id:$id){
    name
    isFollowing 
    isBanned
  }
}
`