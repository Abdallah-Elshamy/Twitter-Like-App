import { gql } from "@apollo/client";

export const RETWEET = gql`
    mutation retweet($tweetId: ID!){
  createRetweet(originalTweetId: $tweetId) {
    id
    originalTweet{ id }
  }
}
`;





