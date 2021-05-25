import { gql } from '@apollo/client';

export const GET_TWEET_REPLIES = gql`
query replies ($tweetId:ID!  $isSFW:Boolean, $page: Int ){
  tweet(id:$tweetId isSFW:$isSFW ) {
        id
        replies(page:$page) {
          totalCount
          tweets{
            id
            text
            likesCount
            quotedRetweetsCount
            retweetsCount
            repliesCount
            createdAt
            isLiked
            state
            mode
            mediaURLs
            user{
              id
              isBanned
              imageURL
              name
              userName
            }
            originalTweet{id}
            repliedToTweet{
              id
              user{
                id
                isBanned
                userName
                name
            }
            }

          }        
          
          
        }        
    }
  }
`

