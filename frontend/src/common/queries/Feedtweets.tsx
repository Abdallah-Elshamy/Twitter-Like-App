import {  gql} from '@apollo/client';



export const FeedTweets = gql `
query feed_tweets{
    getFeed { 
       
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