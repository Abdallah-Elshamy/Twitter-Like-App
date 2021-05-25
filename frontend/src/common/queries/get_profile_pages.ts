import { gql } from "@apollo/client";

export const GET_profile = gql`
query Feed ($id:ID! , $page:Int){
    user(id: $id){  
        userName
        name
        imageURL
        bio
        coverImageURL
        createdAt 
        followingCount
        followersCount
        birthDate
        isBanned
        tweets (page :$page){
          totalCount
        }   
}
}
`