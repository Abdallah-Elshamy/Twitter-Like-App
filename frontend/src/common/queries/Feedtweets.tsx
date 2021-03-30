import { gql } from '@apollo/client';

export const FeedTweets = gql`
query feed_tweets($isSFW:Boolean){
    getFeed (page: 0 isSFW:$isSFW) { 
       
          user {
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
        }
      }
`