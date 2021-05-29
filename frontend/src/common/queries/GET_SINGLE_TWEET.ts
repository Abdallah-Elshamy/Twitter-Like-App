import { gql } from "@apollo/client";

export const GET_SINGLE_TWEET = gql`
    query tweet($tweetId: ID!, $isSFW: Boolean) {
        tweet(id: $tweetId, isSFW: $isSFW) {
            user {
                id
                imageURL
                name
                userName
                isBanned
            }
            originalTweet {
                id
                text
                likesCount
                retweetsCount
                repliesCount
                state
                createdAt
                isLiked
                mediaURLs
                user {
                    id
                    userName
                    name
                    imageURL
                }
                originalTweet {
                    id
                }
                repliedToTweet {
                    id
                    user {
                        id
                        userName
                    }
                }
            }

            repliedToTweet {
                id
                state
                mode
                mediaURLs
                user {
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
            mediaURLs
            repliesCount
            state
            createdAt
            isLiked
            isRetweeted
        }
    }
`;
