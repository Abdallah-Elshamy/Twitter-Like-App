import { gql } from "@apollo/client";

export const Post_Tweet = gql`
mutation createTweet ($tweetInput: TweetCreateInput!) {
  createTweet(tweet : $tweetInput) {
    id
  }
}
`