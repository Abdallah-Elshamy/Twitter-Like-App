import { gql} from '@apollo/client';

export const Tweets = gql `
query tweets ($userId:ID! $filter:String $page:Int $isSFW:Boolean){
  tweets(userId: $userId  filter: $filter page:$page isSFW:$isSFW) { 
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
        mediaURLs
      }
    }}
`

