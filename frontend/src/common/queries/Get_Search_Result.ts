import { gql } from "@apollo/client";

export const Get_Search_Result = gql`
query search (
  $name: String!,
  $page:Int
) {
  users(search:$name,page:$page) {
    users{
      id
      name
      userName
      imageURL
      bio
      isFollowing
      isFollower
      isBanned
    }
    totalCount
  }
}

`