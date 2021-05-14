import { gql } from '@apollo/client';

export const ReportedTweets = gql`
query reportedTweets ($page:Int){
  reportedTweets(page:$page) { 
      totalCount
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
    }}
`
export default ReportedTweets

