import { gql } from "@apollo/client";

const LikeTweet = gql`
    mutation like($tweetId: ID!) {
        like(tweetId: $tweetId)
    }
`;

export default LikeTweet;