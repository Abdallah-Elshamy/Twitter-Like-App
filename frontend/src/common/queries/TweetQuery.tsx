import { gql } from '@apollo/client';

export const Tweets = gql`
query tweets ($userId:ID! $filter:String $page:Int $isSFW:Boolean){
  tweets(userId: $userId  filter: $filter page:$page isSFW:$isSFW) { 
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
           repliedToTweet{
        id
        user{userName}
      }
                    
      repliedToTweet{
        id 
        state
        user{
          id
          userName
          name
          imageURL 

                 }
                     }
                    }

          repliedToTweet{
            id
            state
          mode
          user{
            id
            userName
            name
            imageURL
          } 
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
    }}
`

