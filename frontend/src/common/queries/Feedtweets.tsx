import { gql } from '@apollo/client';

export const FeedTweets = gql`
query feed_tweets($isSFW:Boolean, $page: Int){
    getFeed (page: $page isSFW:$isSFW) { 
      totalCount
      tweets{
        user{
          id
          imageURL
          name
          userName
        }
        originalTweet{
          id 
          text
          likesCount
          retweetsCount
          repliesCount
          state
          createdAt
          isLiked
          user{
            id
            userName
            name
            imageURL
          }
          originalTweet{id}
          mediaURLs
        }
        id
        text 
        likesCount
        retweetsCount
        quotedRetweetsCount
        repliesCount
        state
        createdAt
        isLiked
      }
        }
      }
`