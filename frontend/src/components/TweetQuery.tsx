import { gql} from '@apollo/client';



export const Tweets = gql `
query tweets ($userId:ID! $filter:String $page:Int){
  tweets(userId: $userId  filter: $filter page:$page ) { 
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