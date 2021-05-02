import { gql } from "@apollo/client";

export const Post_Tweet = gql`
    mutation createTweet($tweetInput: TweetCreateInput!) {
        createTweet(tweet: $tweetInput) {
            user {
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
            id
            text
            likesCount
            repliesCount
            createdAt
            isLiked
            mediaURLs
        }
    }
`;
