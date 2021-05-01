import { gql } from '@apollo/client';

export const GET_SINGLE_TWEET = gql`
query tweet ($tweetId:ID!  $isSFW:Boolean){
  tweet(id:$tweetId isSFW:$isSFW) {
   
        user {
          id
          imageURL
          name
          userName
        }
        id
        text 
        likesCount
        repliesCount
        createdAt
        isLiked
        state
        
      }
    }
`

