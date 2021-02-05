import {  gql} from '@apollo/client';



export const Tweets = gql `
query tweets  {
    tweets (userId:1) { 
      totalCount
      tweets{
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
    }}
`