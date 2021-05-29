
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
            isBanned
            following(page:$page){
              totalCount
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
              }
            followers(page:$page){
                totalCount
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
                }
            tweets {
              totalCount
            }  
        }
}`