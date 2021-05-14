import { gql } from '@apollo/client';

export const FeedTweets = gql`
query feed_tweets($isSFW:Boolean, $page: Int){
    getFeed (page: $page isSFW:$isSFW) { 
        tweets{
          user {
            id
            imageURL
            name
            userName
            isBanned
          }
          id
          text 
          likesCount
          repliesCount
          createdAt
          isLiked
          mediaURLs
        }
        totalCount
          
        }
      }
`