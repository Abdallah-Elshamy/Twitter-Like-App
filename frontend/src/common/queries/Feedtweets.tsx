import { gql } from '@apollo/client';

export const FeedTweets = gql`
query feed_tweets($isSFW:Boolean, $page: Int){
    getFeed (page: $page isSFW:$isSFW) { 
       
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
          mediaURLs
        }
      }
`