import { gql } from "@apollo/client";

const UnlikeTweet = gql`
    mutation unlike($tweetId: ID!) {
        unlike(tweetId: $tweetId)
    }
`;

export default UnlikeTweet;