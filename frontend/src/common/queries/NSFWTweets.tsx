import { gql } from '@apollo/client';

export const NSFWTweets = gql`
query NSFWTweets ($page:Int){
  NSFWTweets(page:$page) { 
      totalCount
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
        repliesCount
        createdAt
        isLiked
        mediaURLs
      }
    }}
`
export default NSFWTweets

