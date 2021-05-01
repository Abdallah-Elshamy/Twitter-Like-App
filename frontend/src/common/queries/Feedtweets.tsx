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
          }
          id
          text 
          likesCount
          retweetsCount
          repliesCount
          quotedRetweetsCount
          state
          createdAt
          isLiked
        }
        totalCount
          
        }
      }
`