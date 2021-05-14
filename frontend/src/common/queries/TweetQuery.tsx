import { gql } from '@apollo/client';

export const Tweets = gql`
query tweets ($userId:ID! $filter:String $page:Int $isSFW:Boolean){
  tweets(userId: $userId  filter: $filter page:$page isSFW:$isSFW) { 
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

