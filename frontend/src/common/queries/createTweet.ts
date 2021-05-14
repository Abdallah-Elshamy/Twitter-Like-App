import { gql } from "@apollo/client";

export const Post_Tweet = gql`
    mutation createTweet($tweetInput: TweetCreateInput!) {
        createTweet(tweet: $tweetInput) {
            user {
                id
                imageURL
                name
                userName
                isBanned
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
