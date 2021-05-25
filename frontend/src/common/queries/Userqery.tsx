
import { gql } from '@apollo/client';

export const LoggedUser = gql`
      query logged_user ($id:ID!  $page:Int){
        user(id: $id){  
            id
            userName
            name
            imageURL
            bio
            coverImageURL
            createdAt 
            followingCount
            followersCount
            birthDate
            isFollowing
            isFollower
            following(page:$page){
              users{
              id
              name
              userName
              imageURL
              bio
              isFollowing
              isFollower
              } 
              }
            followers(page:$page){
                users{
                id
                name
                userName
                imageURL
                bio
                isFollowing
                isFollower
                } 
                }
            tweets {
              totalCount
            }  
        }
}`