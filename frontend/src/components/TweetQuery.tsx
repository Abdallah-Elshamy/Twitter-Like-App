import {  gql} from '@apollo/client';



export const Tweets = gql `

query tweets ($userId:ID! $filter:String){
  tweets(userId: $userId  filter: $filter) { 
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