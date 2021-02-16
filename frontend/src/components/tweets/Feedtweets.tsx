import {  gql} from '@apollo/client';



export const FeedTweets = gql `
query feed_tweets{
    getFeed (page: 20) { 
       
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